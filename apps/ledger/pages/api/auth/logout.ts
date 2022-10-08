import { withSession } from '@beta-titan/ledger/services/shared/midleware'
import { getRedisClient, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { IStaffLoginSession } from '@beta-titan/shared/data-types'
import { ObjectId } from 'mongodb'

export default withSession(async (req, res) => {
  const _loginSession : IStaffLoginSession =  req.loginSession
  if (_loginSession) {
    const sessionId = _loginSession._id
    const loginSession = await StaffLoginSessionModel.findOne({_id: new ObjectId(sessionId), logoutTime: 0})
    loginSession.logoutTime = new Date().getTime()
    await loginSession.updateOne(loginSession)
    const clientRedis = await getRedisClient()
    await clientRedis.del('beta-login-session' + sessionId, '.')
  }

  req.session.destroy()
  res.status(200).json({ isLoggedIn: false })
})
