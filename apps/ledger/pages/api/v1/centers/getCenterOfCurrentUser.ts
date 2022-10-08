import { getCenterTreeForUser, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ELoginRole, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

export default withSession(withUserParse(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }
  const re = await getCenterTreeForUser(_loginSession.user._id)
  res.status(200).json({result: re})
}))