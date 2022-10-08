// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
// use with backend
import { withIronSession } from 'next-iron-session'
import { getEnvConfig } from '@beta-titan/shared/utilities'
import { PeopleModel, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ObjectId } from 'mongodb';
import { getCenterPermissionForUser } from '../query-midleware/centers/center-permission-for-user';
import { getRedisClient, redisExpireKey } from '@beta-titan/shared/database-model';
import { StaffModel } from '@beta-titan/shared/database-model';
import { EPermission, ICenter, IGroup } from '@beta-titan/shared/data-types';

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: (getEnvConfig('SECRET_COOKIE_PASSWORD') || 'abcd') as string,
    cookieName: 'session',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  })
}

// required withSession before
export function withUserParse(handler: any) {
  return async function withUserParseHandler(...args: any) {
    const handlerType = args[0] && args[1] ? "api" : "ssr";
    const req = handlerType === "api" ? args[0] : args[0].req;
    const res = handlerType === "api" ? args[1] : args[0].res;

    const _loginSessionId: string = req.session.get('loginSessionId')

    if (!_loginSessionId) {
      req.loginSession = null
      return handler(...args)
    }

    const clientRedis = await getRedisClient()
    const response = await clientRedis.get('beta-login-session' + _loginSessionId, '.')

    if (response) {
      req.loginSession = JSON.parse(response)
      redisExpireKey(clientRedis, 'beta-login-session' + _loginSessionId, 60 * 60 * 24)
      return handler(...args)
    } else {
      const sessionId = _loginSessionId
      const loginSession = await formALoginSession(sessionId)
      if (loginSession) {
        await clientRedis.set('beta-login-session' + _loginSessionId, '.', JSON.stringify(loginSession))
      } else {
        clientRedis.del('beta-login-session' + _loginSessionId, '.')
      }
      req.loginSession = loginSession
      return handler(...args)
    }
  }
}

export const formALoginSession = async (sessionId: string) => {
  let loginSession = await StaffLoginSessionModel.findOne({ _id: new ObjectId(sessionId), logoutTime: 0 })
    .populate({
      path: 'user',
      populate: ['groups', 'preferCenter'].map(v => ({ path: v }))
    })
    .populate('workingCenter')

  if (!loginSession) {
    return null
  }

  const people = await StaffModel.findOne({ _id: loginSession.user._id, deactive: { $ne: true } })
    .populate({ path: 'groups', populate: ['center'] })
    .populate('preferCenter')

  if (!loginSession || !people) {
    
    return null
  }

  // validate the current working center
  let workingCenter: ICenter = ((loginSession.workingCenter as ICenter) && !(loginSession.workingCenter as ICenter).deactive && loginSession.workingCenter)
  let permissions: Array<EPermission> = []
  const { center: _c, permissions: _p } = await getCenterPermissionForUser(people._id.toString(), (workingCenter && workingCenter.code) || '')

  if (_c) {
    workingCenter = _c
    permissions = _p

  } else {
    // find another working center
    workingCenter = ((people.preferCenter as ICenter) && !(people.preferCenter as ICenter).deactive && people.preferCenter) ||
      null

      const { center: _c1, permissions: _p1 } = await getCenterPermissionForUser(people._id.toString(), (workingCenter && workingCenter.code) || '')
    if (_c1) {
      workingCenter = _c1
      permissions = _p1
    } else {
      workingCenter = ((people.groups as Array<IGroup>).map(g => g.center).filter((c: ICenter) => !c.deactive)[0]) ||
        null
        const { center: _c2, permissions: _p2 } = await getCenterPermissionForUser(people._id.toString(), (workingCenter && workingCenter.code) || '')
      if (_c2) {
        workingCenter = _c2
        permissions = _p2
      }
    }
  }
  const workingPermision = permissions

  loginSession.user = people.toObject()
  loginSession.reactiveTime = new Date().getTime()
  loginSession.workingCenter = workingCenter
  loginSession.workingPermision = workingPermision

  await loginSession.updateOne(loginSession)

  loginSession = await StaffLoginSessionModel.findById(loginSession._id)
    .populate({
      path: 'user',
      populate: ['groups', 'preferCenter'].map(v => ({ path: v }))
    })
    .populate('workingCenter')

  return loginSession
}
