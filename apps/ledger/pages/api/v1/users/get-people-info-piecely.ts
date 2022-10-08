import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ELoginRole, EPermission, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { PeopleModel, StaffModel } from '@beta-titan/shared/database-model';


addRuleToIAuthUrlConfig('/api/v1/users/get-people-info-piecely', {
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

  const {key} = req.body

  try {
    const condition = {
      $and: [
        {
          $or: [
            {fullname: {'$regex' : '.*' + key.toLowerCase()+ '.*', $options: 'i'}},
            {code: {'$regex' : '.*' + key.toLowerCase()+ '.*', $options: 'i'}},
            {email: {'$regex' : '.*' + key.toLowerCase()+ '.*', $options: 'i'}},
            {username: {'$regex' : '.*' + key.toLowerCase()+ '.*', $options: 'i'}},
          ],
        }, {
          $or: [
            {
              centers: _loginSession.workingCenter
            },
            {
              centers: null
            }
          ]
        }
      ]
    }
    const users = (
      await PeopleModel.find(condition).limit(10).lean()
    )
    if (users) {
      res.status(200).json({
        error: false,
        data: users,
      })
    }
  } catch (e) {
    res.status(500).json({
      error: true,
      des: {
        vi: `Có lỗi xuất hiện: ${e.toString()}`,
        em: `Error: ${e.toString()}`,
      }

    })
  }
  

}))), ['key'])