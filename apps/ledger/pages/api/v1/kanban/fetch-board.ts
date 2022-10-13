import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, KanbanBoardModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/kanban/fetch-board', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return true
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
  const { code  } = req.body

  const board = await KanbanBoardModel.findOne({
    code: code,
    workingCenter: _loginSession.workingCenter,
  })
  .populate('workingCenter')
  .populate('workingStaffs')
  .populate('defaultAssignee')
  .populate('managers')
  .populate('createdBy')
  .populate('logs')
  .populate('createdBy')
  .lean()

  if (!board) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy bảng này',
      en: 'Can not find this board'
    }})
    return
  }

  res.status(200).json({error: null, data: board})
}))), ['code'])