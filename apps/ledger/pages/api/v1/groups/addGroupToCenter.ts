import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/groups/addgrouptocenter', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.GLOBAL) || p.includes(EPermission.GROUPSMANAGEMENTWrite)
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
  const {
    name } = req.body

  const groups = await GroupModel.find({
    center: _loginSession.workingCenter
  }).lean()

  let found = false 
  for (const group of groups) {
    if (group.name.toLowerCase() === name.toLowerCase()) {
      found = true
    }
  }
  if (found) {
    res.status(200).json({
      error: true,
      des: {
        vi: 'Tên nhóm đã tồn tại',
        en: 'Name is not available'
      }
    })
    return
  }

  const nGroup = new GroupModel({
    name: name.trim(),
    center: _loginSession.workingCenter,
    permissions: [EPermission.BLANK],
    logs: []
  })

  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã tạo một group ${name} ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} created a group ${name} at ${_loginSession.workingCenter.name}`
    },
    createdBy: _loginSession.user
  })
  
  await nLog.save()
  nGroup.logs.push(nLog)
  await nGroup.save()
  res.status(200).json({error: null, re: nGroup})
}))), ['name'])