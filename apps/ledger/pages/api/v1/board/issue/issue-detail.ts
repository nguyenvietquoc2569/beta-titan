import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, IssueModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IIssue, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/issue/issue-detail', {
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
  const { code  }: {code : string} = req.body

  const task = await IssueModel.findOne({
    code: code
  })
    .populate({
      path: 'board',
    })
    .populate({
      path: 'assignees',
      populate: {
        path: 'user'
      }
    })
    .populate({path: 'parent'}).lean()

  if (!task) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy ticket này',
      en: 'Can not find this ticket'
    }})
    return
  }
  if (!(task).board.workingStaffs.map(t=>t.toString()).includes(_loginSession.user._id)) {
    res.status(200).json({error: {
      vi: 'Không có quyền truy cập',
      en: 'No Access'
    }})
    return
  }
  res.status(200).json({error: null, data: task})
}))), ['code'])