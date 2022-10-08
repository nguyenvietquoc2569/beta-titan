import { AutoIdModel, getRedisSemaphore } from '@beta-titan/shared/database-model'

export async function getIncreaseId (id: string) {
  const mutex = await getRedisSemaphore(`auto-id-${id}`, {
    lockTimeout: 5000,
  })
  let _id = null
  try {
    await mutex.acquire()
    
    const autoId = await AutoIdModel.findOneAndUpdate({
      id,
    }, {
      $inc: {
        count: 1
      }
    }, {
      upsert: true
    })

    _id = autoId.count
  } catch (e) {
    return _id
  } finally {
    await mutex.release()
  }
  return _id
}
