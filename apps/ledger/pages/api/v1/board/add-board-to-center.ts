import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel, TaskBoardModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/add-board-to-center', {
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
  const name = 'board - ' + _loginSession.workingCenter.name +  ' - '+new Date().getTime()

  let board = new TaskBoardModel({
    workingCenter: _loginSession.workingCenter,
    defaultAssignee: _loginSession.user,
    workingStaffs: [_loginSession.user],
    name: name,
    description: 'Please edit it',
    createdBy: _loginSession.user,
    deactive: true,
  })

  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã tạo một board [${name}] ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} created a board [${name}] at ${_loginSession.workingCenter.name}`
    },
    createdBy: _loginSession.user
  })
  
  await nLog.save()
  board.logs.push(nLog)
  await board.save()
  
  board = await TaskBoardModel.findOne({
    name: name
  }).lean()


  res.status(200).json({error: null,des: {
    vi: 'Đã tạo board thành công',
    en: 'Board Created'
  }, data: board})
}))), [])