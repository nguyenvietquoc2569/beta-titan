import { IStaffUser } from "../../legacy";

export const notiTimeToLive = 60*60*24*7

export enum ENotificationStatus {
  NEW= 'NEW',
  READ= 'READ',
  DELETE= 'DELETE'
}

export interface INotification {
  _id? : string,
  title: {
    [key: string]: string,
  }
  des: {
    [key: string]: string,
  },
  image?: string,
  url?:string,
  status: ENotificationStatus,
  searchKey: string,
  time: number
}