
import { ENotificationStatus, INotification, IStaffUser, notiTimeToLive } from '@beta-titan/shared/data-types';
import { getRedisClient, redisExpireKey } from '@beta-titan/shared/database-model';
export async function notificationGenerate (
  { title, des, image, url, searchKey}: {
    title: {[key: string]: string},
    des: {[key: string]: string},
    image?: string,
    url?: string,
    searchKey: string
  }
) {
  const notification: INotification = {
    title : title,
    des: des,
    image: image,
    url: url,
    status: ENotificationStatus.NEW,
    searchKey: searchKey,
    time: new Date().getTime(),
  }

  const clientRedis = await getRedisClient()
  await clientRedis.set(searchKey, '.', JSON.stringify(notification))
  await redisExpireKey(clientRedis, searchKey, notiTimeToLive)
}