import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, LogActionModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/groups/add-people-to-group', {
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
    _idGroup, _idStaff } : {_idGroup: string, _idStaff: string} = req.body

  const group = await GroupModel.findOne({
    _id: new ObjectId(_idGroup),
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

  const staff = await StaffModel.findOne({
    _id: new ObjectId(_idStaff)
  })

  if (!staff) {
    res.status(200).json({
      error: true,
      des: {
        vi: 'Nhân viên không tồn tại',
        en: 'Staff is not available'
      }
    })
    return
  }

  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã thêm ${staff.username} vào group ${group.name} ở center ${_loginSession.workingCenter.name}`,
      en: `${_loginSession.user.username} added ${staff.username} into group ${group.name} at center ${_loginSession.workingCenter.name}`,
    },
    createdBy: _loginSession.user
  })
  await nLog.save()
  group.logs.push(nLog)

  staff.groups.push(group)

  staff.save()

  res.status(200).json({
    error: null, data: {
    }
  })
}))), ['_idGroup', '_idStaff'])