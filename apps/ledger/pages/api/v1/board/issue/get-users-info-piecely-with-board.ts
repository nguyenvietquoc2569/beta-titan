import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ELoginRole, EPermission, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { StaffModel, TaskBoardModel } from '@beta-titan/shared/database-model';
import { ObjectId } from 'mongodb';

addRuleToIAuthUrlConfig('/api/v1/board/issue/get-users-info-piecely-with-board', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return true
  },
  role: [ELoginRole.STAFF]
})

export default withParamCheck(withSession(withUserParse(withAuthMiddle(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession.workingCenter) {
    res.status(404).json({result: 'Not Selected a Working Center'})
    return
  }

  const {key, boardId} = req.body

  const board = await TaskBoardModel.findOne({
    _id: new ObjectId(boardId),
    workingStaffs: new ObjectId(_loginSession.user._id),
    deactive: false
  })
  .populate('workingStaffs')

  const regexFilter = new RegExp('.*' + key.toLowerCase()+ '.*', "i")
  const users = board.workingStaffs.filter(user => {
    return (
      user.name.match(regexFilter) ||
      user.emailid.match(regexFilter) ||
      user.username.match(regexFilter)
    )
  })
  res.status(200).json({
    error: false,
    data: users,
  })

}))), ['key','boardId'])