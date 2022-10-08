import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/enable', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.GLOBAL) || p.includes(EPermission.BOARDMANAGER)
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
  const { _id  } = req.body

  const board = await TaskBoardModel.findOne({
    _id: new ObjectId(_id)
  })

  if (!board) {
    res.status(200).json({error: {
      vi: 'Không tìm thấy bảng này',
      en: 'Can not find this board'
    }})
    return
  }

  board.deactive = !board.deactive
  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã ${board.deactive? "deactivated":"activated"} board [${board.name}] ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} ${board.deactive? "deactivated":"activated"} a board [${board.name}] at ${_loginSession.workingCenter.name}`
    },
    createdBy: _loginSession.user
  })
  await nLog.save()
  board.logs.push(nLog)
  await board.save()

  res.status(200).json({error: null, board: board.toObject()})
}))), ['_id'])