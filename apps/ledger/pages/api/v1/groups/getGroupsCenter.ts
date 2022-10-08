import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/groups/getgroupscenter', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.GLOBAL) || p.includes(EPermission.GROUPSMANAGEMENT) || p.includes(EPermission.GROUPSMANAGEMENTWrite)
  },
  role: [ELoginRole.STAFF]
})

export default withSession(withUserParse(withAuthMiddle(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }
  const groups = await GroupModel.find({
    center: _loginSession.workingCenter
  }).lean()
  res.status(200).json({result: groups})
})))