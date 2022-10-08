import { getEnvConfig } from '@beta-titan/shared/utilities';
import * as mongoose from 'mongoose'
import * as Redis from 'ioredis';
import { ReJSON } from 'redis-modules-sdk'
import axios from "axios"
import { Mutex } from 'redis-semaphore'
import RedisIO from 'ioredis'

mongoose.connect(String(getEnvConfig('MONGODBPATH')),{}).then(()=>{
    console.log("connected to mongoDB : ", getEnvConfig('MONGODBPATH'));
    //tool.createadmin();
}).catch((err)=>{
    console.log("Error connecting to database",err);
})

export default mongoose;

let redisClient: ReJSON
let redisIOClient: RedisIO

export const getRedisClient = async () => {
  if (!redisClient || (redisClient && redisClient.redis && redisClient.redis.status !== 'ready')) {
    const connectOpt: Redis.RedisOptions = {
      host: `${getEnvConfig('redisHost')}`,
      port: Number(getEnvConfig('redisPort'))
    }
    redisClient = new ReJSON(connectOpt)
    await redisClient.connect();
    return redisClient
  }
  return redisClient
}

export const getRedisIOClient = async () => {
  if (!redisIOClient || (redisIOClient && redisIOClient.status !== 'ready')) {
    const connectOpt = {
      host: `${getEnvConfig('redisHost')}`,
      port: Number(getEnvConfig('redisPort'))
    }
    redisIOClient = new RedisIO(connectOpt)
    return redisIOClient
  }
  return redisIOClient
}

export const redisExpireKey = async (redisClient1: ReJSON, key: string, timeoutInSecond: number) => {
  await redisClient1.sendCommand({
    command: 'EXPIRE',
    args: [key, `${(timeoutInSecond)}`]
  })
}

export const redisMatch = async (redisClient1: ReJSON, key: string) => {
  return await redisClient1.sendCommand({
    command: 'SCAN',
    args: [0, 'MATCH', key]
  })
}

export async function getRedisSemaphore (key: string, options: any = undefined) {
  const client = (await getRedisIOClient())
  const mutex = new Mutex(client, key, options)
  return mutex
}

const apiMethodName = 'b2_authorize_account';
export interface BzApiType {
  apiUrl: string,
  authToken: string
}

let backblazeKey = {
  apiUrl: '',
  authToken: ''
}

export const getBlazeAuthToken = async () => {
  if (!backblazeKey.apiUrl) {
    const authRes = await axios({
      method: 'GET',
      url: `https://api.backblazeb2.com/b2api/v2/${apiMethodName}`,
      auth: {
          username: getEnvConfig('b2KeyId') as string,
          password: getEnvConfig('b2ApplicationKey') as string, 
      },
    });
    const data = authRes.data;
    backblazeKey = {
      apiUrl: data.apiUrl,
      authToken: data.authorizationToken,
    }

    setTimeout(() => {
      backblazeKey = {
        apiUrl: '',
        authToken: ''
      }
    }, 60 * 60 * 24 * 1000)
  } 
  return (backblazeKey)
}