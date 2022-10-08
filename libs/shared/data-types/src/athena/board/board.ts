import { ICenter } from "../center";
import { IStaffUser } from "../../";
import { ILogAction } from "../log";

export interface ITaskBoard {
  _id?: string,
  workingCenter: ICenter,
  defaultAssignee?: IStaffUser,
  workingStaffs: Array<IStaffUser>,

  name: string,
  description: string,
  
  createdBy: IStaffUser,
  deactive: boolean,
  logs: Array<ILogAction>,

  logo?: string,
}