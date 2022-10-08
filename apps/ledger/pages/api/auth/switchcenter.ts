import { getCenterPermissionForUser, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ELoginRole, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { getRedisClient, StaffLoginSessionModel } from '@beta-titan/shared/database-model';
import { ObjectId } from 'mongodb';


export default withSession(withUserParse(async (req, res) => {
  const _loginSession : IStaffLoginSession =  req.loginSession
  
  const {code} = req.body

  const sessionId = _loginSession._id

  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'error code 1231 - session end'})
    return
  }

  const { center, permissions} = await getCenterPermissionForUser(_loginSession.user._id, code)

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
    const loginSession = await StaffLoginSessionModel.findOne({_id: new ObjectId(sessionId), logoutTime: 0})
    loginSession.workingCenter = center
    loginSession.workingPermision = permissions
    await loginSession.updateOne(loginSession)
    const clientRedis = await getRedisClient()
    await clientRedis.del('beta-login-session' + sessionId, '.')
    res.status(200).json({result: 'success'})
  }
}))