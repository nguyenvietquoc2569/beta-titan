import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { GroupModel, StaffLoginSessionModel } from '@beta-titan/shared/database-model'
import { ELoginRole, ENotificationStatus, EPermission, EUserPermissions, INotification, IStaffLoginSession, notiTimeToLive } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { getRedisClient, redisExpireKey, redisMatch } from '@beta-titan/shared/database-model';

addRuleToIAuthUrlConfig('/api/v1/notifications/action', {
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

  const { key, status }: {key: string, status: ENotificationStatus} = req.body

  const clientRedis = await getRedisClient()
  const _nofi = await clientRedis.get(key)
  let nofi: INotification

  if (_nofi) {
    nofi = JSON.parse(_nofi)
  } else {
    res.status(200).json({
      error: {
        vi: 'Không tìm thấy',
        en: 'not found'
      }
    })
  }

  nofi.status = status

  await clientRedis.set(key, '.', JSON.stringify(nofi))
  await redisExpireKey(clientRedis, key, notiTimeToLive)
  res.status(200).json(
    {
      data: nofi
    }
  )
})))