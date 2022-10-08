import { ICenter, ILogAction } from '../../athena';
import { IStaffUser } from '../../legacy';

export interface IKanbanBoard {
  _id?: string,
  code: string,
  workingCenter?: ICenter,
  defaultAssignee?: IStaffUser,
  workingStaffs: Array<IStaffUser>,
  managers: Array<IStaffUser>,
  labels: Array<{
    label: string,
    color: string
  }>,

  states: Array<string>,

  name: string,
  description: string,
  
  createdBy?: IStaffUser,
  deactive: boolean,
  logs: Array<ILogAction>,

  logo?: string,
}

export const defaultIKanbanBoard: IKanbanBoard = {
  code: '',
  workingStaffs: [],
  managers: [],
  labels: [],
  states: [],
  name: '',
  description: '',
  deactive: false,
  logs: [], 
  logo: ''
}