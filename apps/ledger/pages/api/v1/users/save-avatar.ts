import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ELoginRole, EPermission, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { getRedisClient, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model';
import { ObjectId } from 'mongodb'

addRuleToIAuthUrlConfig('/api/v1/users/save-avatar', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return true
  },
  role: [ELoginRole.STAFF]
})

export default withParamCheck(withSession(withUserParse(withAuthMiddle(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession.workingCenter) {
    res.status(404).json({result: 'Not Selected a Working Center'})
    return
  }

  const {avatar} = req.body

  const user = await StaffModel.findOne({
    _id: new ObjectId(_loginSession.user._id)
  })

  user.avatar = avatar
  await user.save()

  const loginSession = await StaffLoginSessionModel.findById(_loginSession._id)
    .populate({
      path: 'user',
      populate: ['groups', 'preferCenter'].map(v => ({path: v}))
    })
    .populate('workingCenter')

  req.session.set('loginSessionId', loginSession._id.toString())
  await req.session.save()
  const clientRedis = await getRedisClient()
  await clientRedis.del('beta-login-session' + loginSession._id.toString(), '.')

  res.status(200).json({
    error: false
  })
  
}))), ['avatar'])