import { IStaffUser } from "..";
import { ICenter } from "./center";
import { EPermission } from "./permission";

export enum ELoginRole {
  STAFF='staff',
  CLIENT='client'
}

export interface IStaffLoginSession {
  _id: string,
  user: IStaffUser,
  loginTime: number,
  reactiveTime: number,
  role: ELoginRole,
  workingCenter?: ICenter,
  workingPermision: Array<EPermission>
  logoutTime: number,
  legacyToken?: string
}

