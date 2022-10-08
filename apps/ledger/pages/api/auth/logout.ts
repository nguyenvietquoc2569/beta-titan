import { withSession } from '@beta-athena/beta/backend'
import { getRedisClient, StaffLoginSessionModel } from '@beta-athena/shared/database-model'
import { IStaffLoginSession } from '@beta-athena/shared/data-types'
import { ObjectId } from 'mongodb'

export default withSession(async (req, res) => {
  const _loginSession : IStaffLoginSession =  req.loginSession
  if (_loginSession) {
    let sessionId = _loginSession._id
    let loginSession = await StaffLoginSessionModel.findOne({_id: new ObjectId(sessionId), logoutTime: 0})
    loginSession.logoutTime = new Date().getTime()
    await loginSession.updateOne(loginSession)
    let clientRedis = await getRedisClient()
    await clientRedis.del('beta-login-session' + sessionId, '.')
  }

  req.session.destroy()
  res.status(200).json({ isLoggedIn: false })
})
