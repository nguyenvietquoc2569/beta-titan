import { addRuleToIAuthUrlConfig, getCenterTreeForUser, globalConstGetIncreaseTicketCount, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { getRedisSemaphore, GroupModel, IssueModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { EIssuePriority, EIssueStatus, EIssueType, ELoginRole, EPermission, EUserPermissions, IIssue, IStaffLoginSession, ITaskBoard } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/add-new-issue', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return true
  },
  role: [ELoginRole.STAFF]
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

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
  const { title, issueType, boardId  }: { title: string, issueType: EIssueType, boardId: string  } = req.body

  const board = await TaskBoardModel.findOne({
    _id: new ObjectId(boardId)
  }).lean()

  if (!board) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy bảng này',
      en: 'Can not find this board'
    }})
    return
  }

  const newCode = await globalConstGetIncreaseTicketCount()

  const newIssueLogic: IIssue = {
    board: board,
    title: title,
    description: '',
    type: issueType,
    code: newCode,
    assignees: [{
      point: 0,
      user: board.defaultAssignee,
      note: ''
    }],
    reporter: _loginSession.user,
    priority: EIssuePriority.High,
    estimateHour: 2,
    lastUpdateTime: new Date().getTime(),
    createdAt: new Date().getTime(),
    attachments: [],
    comments: [],
    status: EIssueStatus.Backlog,
    statusTransitions: [{
      from: EIssueStatus.Backlog,
      to: EIssueStatus.Backlog,
      time: new Date().getTime(),
      movedBy: _loginSession.user
    }],
    order: 0,
    history: [{
      des: {
        vi: `Ticket được tạo bởi ${_loginSession.user.name} lúc ${new Date().toISOString()}`,
        en: `Created by ${_loginSession.user.name} at ${new Date().toISOString()}`
      },
      time: new Date().getTime(),
    }]
  }

  const mutex = await getRedisSemaphore(`board-${board._id}-${EIssueStatus.Backlog}`, {
    lockTimeout: 5000,
  })

  let issue
  
  try {
    await mutex.acquire()
    await IssueModel.updateMany({
      board: board,
      status: EIssueStatus.Backlog,
    }, {
      $inc: {
        order: 1
      }
    })
  
    issue = new IssueModel(newIssueLogic)
    await issue.save()
  } finally {
    await mutex.release()
  }
  

  const issueQ = await IssueModel.findOne({
    _id: issue._id
  })
  .populate({
    path: 'assignees',
    populate: {
      path: 'user'
    }
  })

  res.status(200).json({error: null, data: issueQ})
}))), ['title', 'issueType', 'boardId'])