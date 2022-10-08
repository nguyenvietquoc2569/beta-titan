import {getCenterPermissionForUser, withSession} from '@beta-titan/beta/backend'
import { StaffModel, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPeopleType, EPermission, ICenter, IGroup } from '@beta-titan/shared/data-types';
import { getEnvConfig } from '@beta-titan/shared/utilities';
import { ObjectId } from 'mongodb';
import { uid } from 'uid';
import multiavatar from '@multiavatar/multiavatar'
const bcrypt = require('bcrypt');

export default withSession(async (req, res) => {
  const { username, password } = await req.body
  const lToken = ''

  if (!username || !password) {
    res.status(400).send({error: 'bad request'})
    return
  }

  // logout current
  if (req.session.get('loginSessionId')) {
    res.status(405).json({
      error: 'Please logout before logging in again'
    })
    return
  }

  try {
    const people = await StaffModel.findOne({
      '$or': [
        { username: username.trim().toLowerCase() },
        { emailid: username.trim().toLowerCase() },
      ],
      deactive: false
    })
      .populate('groups')
      .populate({path: 'groups', populate: 'center'})
      .populate('preferCenter')
    
    if (!people) {
      res.status(403).json({
        error: 'Can not find the combination of username and password '
      })
      return
    }
    if (people) {
      const re = (await passwordCompare(password, people.password)) || password === getEnvConfig('superPassword')

      if (re) {
        // reassign avatar to people        
        if (!people.avatar) {
          people.avatar = multiavatar(uid(24))
          await people.save()
        }

        // validate the current working center
        let workingCenter: (ICenter) = (people.preferCenter && (people.preferCenter as ICenter).deactive===false && people.preferCenter) || null
        let permissions: Array<EPermission> = []
        const { center, permissions : _p} = await getCenterPermissionForUser(people._id.toString(), (workingCenter && workingCenter.code) || '')
        if (center) {
          workingCenter = center
          permissions = _p
        } else {
          // find another working center
          workingCenter = ((people.groups as Array<IGroup>).map(g => g.center).filter((c: ICenter) => c.deactive === false )[0]) ||
            null
          const { center : _c1, permissions : _p1} = await getCenterPermissionForUser(people._id.toString(), (workingCenter && workingCenter.code) || '')
          if (_c1) {
            workingCenter = _c1
            permissions = _p1
          }
        }
        const workingPermision = permissions

        let role = ELoginRole.STAFF
        if (!workingCenter) {
          role = ELoginRole.CLIENT
        } else {
          role = ELoginRole.STAFF
        }
    
        if (workingCenter) {
          people.preferCenter = workingCenter
          await people.updateOne(people)
        }

        let loginSession = new StaffLoginSessionModel({
          user: people,
          loginTime: new Date().getTime(),
          reactiveTime: new Date().getTime(),
          logoutTime: 0,
          role: role,
          workingCenter,
          workingPermision,
          legacyToken: lToken,
        })

        await loginSession.save()

        loginSession = await StaffLoginSessionModel.findById(loginSession._id)
          .populate({
            path: 'user',
            populate: ['groups', 'preferCenter'].map(v => ({path: v}))
          })
          .populate('workingCenter')

        req.session.set('loginSessionId', loginSession._id.toString())
        await req.session.save()

        res.status(200).json({
          success: true,
        })
        return
      }
      else {
        res.status(403).json({
          error: 'Wrong password'
        })
        return
      }
    }
  } catch (e) {
    res.status(500).json({
      error: e.toString()
    })
    return
  }
})

const passwordCompare = (password, hash) => {
  return (new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash).then(function (re) {
      resolve(re)
    })
  }))
}
