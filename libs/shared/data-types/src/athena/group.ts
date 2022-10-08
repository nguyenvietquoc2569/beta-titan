import { ICenter } from "./center";
import { ILogAction } from "./log";
import { EPermission } from "./permission";

export enum EBasicGroup {
  STAFFGROUP = 'Staff Group - Nhân viên'
}

export interface IGroup {
  _id: string,
  center: ICenter,
  name: string,
  permissions: Array<EPermission>,
  logs: Array<ILogAction>
}