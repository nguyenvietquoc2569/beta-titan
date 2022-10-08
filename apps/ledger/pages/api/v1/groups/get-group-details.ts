import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/groups/get-group-details', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.GLOBAL) || p.includes(EPermission.GROUPSMANAGEMENT)
  },
  role: [ELoginRole.STAFF]
})

export default withParamCheck(withSession(withUserParse(withAuthMiddle(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }
  if (!_loginSession.workingCenter) {
    res.status(403).json({result: 'No Working Center'})
    return
  }
  const {
    _id } = req.body

  const group = await GroupModel.findOne({
    _id: new ObjectId(_id),
    center: _loginSession.workingCenter
  }).lean()

  if (!group) {
    res.status(200).json({
      error: true,
      des: {
        vi: 'Nhóm không tồn tại',
        en: 'Group is not available'
      }
    })
    return
  }

  const staffs = await StaffModel.find({
    groups: new ObjectId(_id),
  }).lean()

  res.status(200).json({
    error: null, data: {
      group,
      staffs
    }
  })
}))), ['_id'])