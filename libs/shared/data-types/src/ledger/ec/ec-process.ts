import { string } from 'yup';
import { ICenter } from '../../athena';
import { IPeople, IStaffUser } from '../../legacy';

export enum EECProcessSource {
  Walking='Khách vãng lai',
  Facebook='Facebook',
  Zalo='Zalo',
  Website='Website',
  Friend='Friend',
  Google='Google',
  Phone='Điện thoại',
  Other='Other'
}

export const eECProcessSourceArray = [
  {value: EECProcessSource.Walking, label: EECProcessSource.Walking},
  {value: EECProcessSource.Facebook, label: EECProcessSource.Facebook},
  {value: EECProcessSource.Zalo, label: EECProcessSource.Zalo},
  {value: EECProcessSource.Friend, label: EECProcessSource.Friend},
  {value: EECProcessSource.Website, label: EECProcessSource.Website},
  {value: EECProcessSource.Google, label: EECProcessSource.Google},
  {value: EECProcessSource.Phone, label: EECProcessSource.Phone},
  {value: EECProcessSource.Other, label: EECProcessSource.Other},
]
export interface IECProcess {
  assignees: Array<{
    assignee: IStaffUser,
    point: number,
    datePoint?: Date
  }>,
  center?: ICenter,
  student?: IPeople,
  createdDay: Date,
  tags: Array<string>,
  referer?: IPeople,
  source: EECProcessSource,
  des: string,
  comments: Array<{
    commenter: IStaffUser,
    content: string,
    timestamp: Date
  }>
}

export const defaultIECProcess: IECProcess = {
  assignees: [],
  createdDay: new Date(),
  tags: [],
  source: EECProcessSource.Other,
  des: '',
  comments: []
}