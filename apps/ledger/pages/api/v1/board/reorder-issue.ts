import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { getRedisSemaphore, GroupModel, IssueModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { EIssueStatus, ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/reorder-issue', {
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
  const { _id, newOrder } = req.body

  const task = await IssueModel.findOne({
    _id: new ObjectId(_id)
  })

  if (!task) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy ticket này',
      en: 'Can not find this issue'
    }})
    return
  }

  const oldOrder = task.order

  const mutex = await getRedisSemaphore(`board-${task.board}-${task.status}`, {
    lockTimeout: 5000,
  })

  try {
    await mutex.acquire()
    if (newOrder < oldOrder) {
      await IssueModel.updateMany({
        board: task.board,
        status: task.status,
        $and: [
          {
            order: {$gte: newOrder}
          },
          {
            order: {$lt: oldOrder}
          }
        ]
      }, {
        $inc: {
          order: 1
        }
      })
      task.order = newOrder
      await task.save()
    } else {
      await IssueModel.updateMany({
        board: task.board,
        status: task.status,
        $and: [
          {
            order: {$lte: newOrder}
          },
          {
            order: {$gt: oldOrder}
          }
        ]
      }, {
        $inc: {
          order: -1
        }
      })
      task.order = newOrder
      await task.save()
    }
  } catch(e) {
    await mutex.release()
  }finally {
    await mutex.release()
  }
  res.status(200).json({error: null})
}))), ['_id', 'newOrder'])
