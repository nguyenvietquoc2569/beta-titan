import { getCenterTreeForUser, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { CourseModel } from '@beta-titan/shared/database-model'
import { ELoginRole, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

export default withParamCheck(withSession(withUserParse(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }
  const { condition: _con, notId: _notId } = req.body
  const condition = JSON.parse(_con)
  const notId = _notId ? new ObjectId(_notId) : ""
  
  if (notId !== "") {
    condition._id = {"$ne": notId}
  }
  
  condition.center = _loginSession.workingCenter

  const count = await CourseModel.find(condition).count()

  res.status(200).json({result: count})
})), ['condition', 'notId'])
