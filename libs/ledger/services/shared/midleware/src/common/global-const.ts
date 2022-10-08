import { IGlobalConst } from "@beta-titan/shared/data-types";
import { getRedisSemaphore, GlobalConst } from "@beta-titan/shared/database-model";

export async function globalConstGetIncreaseTicketCount () {
  let result = 0

  const mutex = await getRedisSemaphore(`sem-GlobalConst`, {
    lockTimeout: 5000,
  })

  try {
    await mutex.acquire()
    let constGlobal =  await GlobalConst.findOne({})
    if (!constGlobal) {
      const instance: IGlobalConst = {
        ticketCount: 1
      }
      constGlobal = new GlobalConst(instance)
      result = 1
      await constGlobal.save()
    } else {
      result = constGlobal.ticketCount + 1
      constGlobal.ticketCount = constGlobal.ticketCount + 1
      await constGlobal.save()
    }
    await mutex.release()
  } catch (e) {
    await mutex.release()
  }

  return `TKT-${result}`
}