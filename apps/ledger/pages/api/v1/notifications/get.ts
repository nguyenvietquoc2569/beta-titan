import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, INotification, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { getRedisClient, redisExpireKey, redisMatch } from '@beta-titan/shared/database-model';

addRuleToIAuthUrlConfig('/api/v1/notifications/get', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return true
  },
  role: [ELoginRole.STAFF]
})

export default withSession(withUserParse(withAuthMiddle(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }

  const id = _loginSession.user._id
  const clientRedis = await getRedisClient()
  const response = await redisMatch(clientRedis, `beta-notifications-${id}-*`)
  const keys = response[1]

  let data = []

  for(const key of keys) {
    const j = await clientRedis.get(key)
    data.push(JSON.parse(j))
  }

  data = data.sort((a:INotification, b: INotification) => a.time - b.time)
  
  res.status(200).json(
    {
      data
    }
  )
})))