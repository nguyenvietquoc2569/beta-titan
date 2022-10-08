import { withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { IECProcess, IPeople, IStaffLoginSession } from '@beta-titan/shared/data-types'
import { ECProcessModel, PeopleModel } from '@beta-titan/shared/database-model'
import ShortUniqueId from 'short-unique-id'

export default withParamCheck(withSession(withUserParse(
  // withAuthMiddle
  (async (req, res) => {
  const uid = new ShortUniqueId({ length: 10 })
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
    isNewStudent,
    isNewParent,
    student,
    parent,
    process,
    parentSkip
  } : {
    isNewStudent: boolean,
    isNewParent: boolean,
    student: IPeople,
    parent: IPeople,
    process: IECProcess,
    parentSkip: boolean
  } = req.body

  
  process.center = _loginSession.workingCenter
  process.assignees = [{
    assignee: _loginSession.user,
    point: 0,
    datePoint: new Date()
  }]
  process.createdDay = new Date()
  process.tags = []
  process.comments = [{
    commenter: _loginSession.user,
    content: 'System: Created by ' + _loginSession.user.name,
    timestamp: new Date()
  }]

  // -----
  let _student: any = student
  if (isNewStudent) {
    delete _student._id
    _student = new PeopleModel({
      ...student,
      centers: [_loginSession.workingCenter],
      code: uid()
    })
    await _student.save()
  } else {
    _student = await PeopleModel.findOne({
      code: student.code
    })
    if (!_student.centers.map((x => x.toString())).includes(_loginSession.workingCenter._id)) {
      _student.centers.push(_loginSession.workingCenter)
      await _student.save()
    }
  }

  process.student = _student
  const _process = new ECProcessModel(process)

  await (_process).save()

  // connect parent
  if (parentSkip) {
    res.status(200).json({
      error: null
    })
  } else {

    let _parent: any = parent
    if (isNewParent) {
      delete _parent._id
      _parent = new PeopleModel({
        ...parent,
        code: uid(),
      })
      await _parent.save()
    } else {
      _parent = await PeopleModel.findOne({
        code: parent.code
      })
      if (!_parent.centers.map((x => x.toString())).includes(_loginSession.workingCenter._id)) {
        _parent.centers.push(_loginSession.workingCenter)
        await _parent.save()
      }
    }

    if (_student.guardians) {
      _student.guardians.push(_parent)
    } else {
      _student.guardians = [_parent]
    }
    await _student.save()

    res.status(200).json({
      error: null
    })
  }
}))), ['isNewStudent', 'isNewParent', 'student', 'process', 'parentSkip'])