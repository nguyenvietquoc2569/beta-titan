import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, IssueModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { EIssueHistoryType, ELoginRole, EPermission, EUserPermissions, IIssue, IIssueAssignees, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/issue/issue-update', {
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
  const {code, field, payload}: {code : string, field: string, payload: any} = req.body

  let task = await IssueModel.findOne({
    code: code
  }).populate({
    path: 'board',
  })

  if (!(task).board.workingStaffs.map(t=>t.toString()).includes(_loginSession.user._id)) {
    res.status(200).json({error: {
      vi: 'Không có quyền truy cập',
      en: 'No Access'
    }})
    return
  }

  if (!task) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy ticket này',
      en: 'Can not find this ticket'
    }})
    return
  }

  if (field === 'title') {
    const title: string = payload
    const oldTitle = task.title 
    task.title = title

    task.history.push({
      des: {
        vi: `Tiêu đề được thay đổi bởi ${_loginSession.user.name}`,
        en: `Title was changed by ${_loginSession.user.name}`
      },
      time: new Date().getTime(),
      from: oldTitle,
      to: title,
      typeUpdate: EIssueHistoryType.updateeTitle
    })
  } else if (field === 'description') {
    const description: string = payload
    const oldDescription = task.description 
    task.description = description

    task.history.push({
      des: {
        vi: `Mô tả được thay đổi bởi ${_loginSession.user.name}`,
        en: `Description was changed by ${_loginSession.user.name}`
      },
      time: new Date().getTime(),
      from: oldDescription,
      to: description,
      typeUpdate: EIssueHistoryType.updateDes
    })
  } else if (field === 'assignees') {
    const assignees : IIssueAssignees = payload
    const oldAssignees : IIssueAssignees = task.assignees 
    task.assignees = assignees
    
    task.history.push({
      des: {
        vi: `Thay đổi người phụ trách ${_loginSession.user.name}`,
        en: `Assignees were changed by ${_loginSession.user.name}`
      },
      time: new Date().getTime(),
      from: oldAssignees.map(t => `${t.user.username}(${t.point})`).join(','),
      to: assignees.map(t => `${t.user.username}(${t.point})`).join(','),
      typeUpdate: EIssueHistoryType.updateAssignees
    })
  }

  await task.save()

  task = await IssueModel.findOne({
    code: code
  }).populate({
    path: 'board',
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

  res.status(200).json({error: null, data: task})
}))), ['code','field','payload'])