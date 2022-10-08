import { getCenterTreeForUser, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { CourseModel } from '@beta-titan/shared/database-model'
import { ELoginRole, ICourse, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb'

export default withParamCheck(withSession(withUserParse(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }
  const { course } : {course: ICourse} = req.body
  delete course._id

  console.log(course)
  course.center = _loginSession.workingCenter

  course.changeHistory = [{
    changedBy: _loginSession.user,
    from: '',
    to: JSON.parse((JSON.stringify(course)))
  }]

  const model = new CourseModel(course)
  await model.save()

  res.status(200).json({error: null})
})), ['course'])
