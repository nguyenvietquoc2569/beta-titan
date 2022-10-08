import {ICenter} from '../../athena/center'
import { IStaffUser } from '../../legacy'
export interface ICourse {
  _id?: string,
  code: string,
  name: string,
  numSession: number,
  numHours: number,
  center?: ICenter,
  description: string,
  price: number,
  isActive: boolean,
  changeHistory: Array<{
    changedBy: IStaffUser,
    from: any,
    to: any
  }>
}