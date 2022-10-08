import { IStaffUser } from "../legacy"
import { ICenter } from "./center"

export interface ILogAction {
  time: number,
  center: ICenter,
  des: {
    vi: string,
    en: string,
    [key: string]: string
  },
  createdBy: IStaffUser,
  extraInfo?: any
}