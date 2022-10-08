import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/groups/add-permission-to-group', {
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
    _id, permission } : {_id: string, permission: EPermission} = req.body

  if (!_loginSession.workingPermision.includes(permission) && !_loginSession.workingPermision.includes(EPermission.GLOBAL)) {
    res.status(200).json({
      error: true,
      des: {
        vi: 'Bạn không có quyền cấp quyền này cho người khác',
        en: 'You are not allowed to grant this permission to other'
      }
    })
    return
  }

  const group = await GroupModel.findOne({
    _id: new ObjectId(_id),
    center: _loginSession.workingCenter
  })

  
  if (!group) {
    res.status(200).json({
      error: true,
      des: {
        vi: 'Nhóm không tồn tại',
        en: 'Group is not available'
      }
    })
    return
  }

  let added = false
  if (group.permissions.includes(permission)) {
    group.permissions = group.permissions.filter(per => per!==permission)
  } else {
    group.permissions.push(permission)
    added = true
  }

  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã ${added===false?'xoá':'thêm'} quyền ${permission} vào group ${group.name} ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} ${added===false?'removed':'added'} permission ${permission} into group ${group.name} at center ${_loginSession.workingCenter.name}`,
    },
    createdBy: _loginSession.user
  })
  await nLog.save()
  
  group.logs.push(nLog)
  await group.save()

  res.status(200).json({
    error: null, data: {
    }
  })
}))), ['_id', 'permission'])