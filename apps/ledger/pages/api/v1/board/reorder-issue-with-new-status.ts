import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { getRedisSemaphore, GroupModel, IssueModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { EIssueStatus, ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/reorder-issue-with-new-status', {
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
  const { _id, newOrder, newStatus }: {_id: string, newOrder: number, newStatus: EIssueStatus} = req.body

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

  const mutexOld = await getRedisSemaphore(`board-${task.board}-${task.status}`, {
    lockTimeout: 5000,
  })
  const mutexNew = await getRedisSemaphore(`board-${task.board}-${newStatus}`, {
    lockTimeout: 5000,
  })

  try {
    await mutexOld.acquire()
    await mutexNew.acquire()

    await IssueModel.updateMany({
      board: task.board,
      status: task.status,
      $and: [
        {
          order: {$gt: oldOrder}
        }
      ]
    }, {
      $inc: {
        order: -1
      }
    })

    await IssueModel.updateMany({
      board: task.board,
      status: newStatus,
      $and: [
        {
          order: {$gte: newOrder}
        }
      ]
    }, {
      $inc: {
        order: 1
      }
    })

    task.history.push({
      time: new Date().getTime(),
      des: {
        vi: `${_loginSession.user.username} đã chuyển ticket từ ${task.status} thành ${newStatus}`,
        en: `${_loginSession.user.username} transited ${task.status} to ${newStatus}`,
      }
    })

    task.statusTransitions.push({
      from: task.status,
      to: newStatus,
      time: new Date().getTime(),
      movedBy: _loginSession.user
    })
    task.status = newStatus
    task.order = newOrder

    await task.save()
  } catch(e) {
    await mutexNew.release()
    await mutexOld.release()
  } finally {
    await mutexNew.release()
    await mutexOld.release()
  }

  res.status(200).json({error: null})
}))), ['_id', 'newOrder', 'newStatus'])
