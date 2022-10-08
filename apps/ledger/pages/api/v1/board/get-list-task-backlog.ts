import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, IssueModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { EIssueStatus, ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/get-list-task-backlog', {
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
  const { _id } = req.body

  const board = await TaskBoardModel.findOne({
    _id: new ObjectId(_id),
    workingStaffs: new ObjectId(_loginSession.user._id),
    deactive: false
  })

  if (!board) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy bảng này',
      en: 'Can not find this board'
    }})
    return
  }

  const tasks = await IssueModel.find({
    board: board,
    status: {
      $in: [EIssueStatus.Backlog, EIssueStatus.Selected]
    }
  }).populate({
    path: 'assignees',
    populate: {
      path: 'user'
    }
  }).populate({path: 'parent'}).lean()

  res.status(200).json({error: null, data: tasks})
}))), ['_id'])