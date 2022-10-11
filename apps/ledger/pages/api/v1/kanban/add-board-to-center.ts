import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, KanbanBoardModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IKanbanBoard, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { getIncreaseId } from '@beta-titan/ledger/services/shared/utils';

addRuleToIAuthUrlConfig('/api/v1/kanban/add-board-to-center', {
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
  const data: IKanbanBoard = req.body.data
  const code ='KBoard-' + (await getIncreaseId('KBoard'))

  let board = new KanbanBoardModel({
    ...data,
    workingCenter: _loginSession.workingCenter,
    createdBy: _loginSession.user,
    code
  })

  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã tạo một board ${code} ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} created a board ${code} at ${_loginSession.workingCenter.name}`
    },
    createdBy: _loginSession.user,
  })
  
  await nLog.save()
  board.logs.push(nLog)
  await board.save()
  
  board = await KanbanBoardModel.findOne({
    code: code
  }).lean()

  res.status(200).json({error: null,des: {
    vi: 'Đã tạo board thành công',
    en: 'Board Created'
  }, data: board})
}))), ['data'])