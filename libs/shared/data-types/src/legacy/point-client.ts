import { IPeople } from "./people";
import { IStaffUser } from "./staff-user-type";

export enum IPointClientTransactionStatus {
  INIT = 'Init',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export type IPointClientTransaction = {
  client: IPeople,
  date: number,
  des: string,
  staff: IStaffUser,
  approveStaff: IStaffUser,
  approveDay: number,
  status: IPointClientTransactionStatus,
  point: number
}