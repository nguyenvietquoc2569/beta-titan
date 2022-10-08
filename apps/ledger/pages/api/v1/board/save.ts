import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession, ITaskBoard } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/save', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.GLOBAL) || p.includes(EPermission.BOARDMANAGER)
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
  let { _id, _board  }: {_id: string, _board: ITaskBoard} = req.body

  let board = await TaskBoardModel.findOne({
    _id: new ObjectId(_id)
  })

  if (!board) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy bảng này',
      en: 'Can not find this board'
    }})
    return
  }

  board.defaultAssignee = _board.defaultAssignee
  board.workingStaffs = _board.workingStaffs
  board.name = _board.name
  board.description = _board.description

  let nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã sưả một board [${board.name}] ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} editted a board [${board.name}] at ${_loginSession.workingCenter.name}`
    },
    createdBy: _loginSession.user
  })
  await nLog.save()
  board.logs.push(nLog)

  await board.save()
  res.status(200).json({error: null, data: board})
}))), ['_id', '_board'])