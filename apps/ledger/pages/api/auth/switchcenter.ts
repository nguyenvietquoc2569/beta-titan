import { getCenterPermissionForUser, withSession, withUserParse } from '@beta-athena/beta/backend'
import { ELoginRole, IStaffLoginSession } from '@beta-athena/shared/data-types';
import { getRedisClient, StaffLoginSessionModel } from '@beta-athena/shared/database-model';
import { ObjectId } from 'mongodb';


export default withSession(withUserParse(async (req, res) => {
  const _loginSession : IStaffLoginSession =  req.loginSession
  
  const {code} = req.body

  let sessionId = _loginSession._id

  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'error code 1231 - session end'})
    return
  }

  let { center, permissions} = await getCenterPermissionForUser(_loginSession.user._id, code)

  if (!center || permissions.length===0) {
    if (!_loginSession) {
      req.loginSession = null
      res.status(403).json({result: 'error code 1232 - you dont have access to this center'})
      return
    } else {
      res.status(403).json({result: 'Should re-login'})
      return
    }
  } else {
    let loginSession = await StaffLoginSessionModel.findOne({_id: new ObjectId(sessionId), logoutTime: 0})
    loginSession.workingCenter = center
    loginSession.workingPermision = permissions
    await loginSession.updateOne(loginSession)
    let clientRedis = await getRedisClient()
    await clientRedis.del('beta-login-session' + sessionId, '.')
    res.status(200).json({result: 'success'})
  }
}))