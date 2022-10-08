import { IStaffUser } from "../../legacy";
import { ITaskBoard } from "./board";

export enum EIssuePriority {
  Highest = 'highest',
  High = 'high',
  Low = 'low',
  Lowest = "lowest",

}

export enum EIssueStatus {
  Backlog = 'backlog',
  Selected = 'selected',
  InProgress = 'in progress',
  Blocked = 'blocked',
  Review = 'review',
  Done = 'done',
  Trash = 'trash'
}

export enum EIssueType {
  story = 'story',
  task = 'task',
  epic = 'epic'
}

export type IIssueAssignees = Array<{
  point: number,
  user: IStaffUser,
  note: string
}>

export enum EIssueHistoryType {
  newTicket = 'New Ticket',
  updateeTitle= 'Update Title',
  updateDes = 'Update Description',
  updateAssignees = 'Update Assignees'
}

export interface IIssue {
  _id?: string,
  board?: ITaskBoard,
  title: string,
  description: string,
  type: EIssueType,

  order: number,
  code: string,
  
  assignees: IIssueAssignees,
  reporter: IStaffUser,
  priority: EIssuePriority,
  estimateHour: number,

  lastUpdateTime: number,
  createdAt: number,

  attachments:Array<{
    uploadedBy: IStaffUser,
    link: string
  }>,

  comments: Array<{
    time: number,
    commentedBy: IStaffUser,
    note: string
  }>,

  status: EIssueStatus,

  statusTransitions : Array<{
    from: EIssueStatus,
    to: EIssueStatus,
    time: number,
    movedBy: IStaffUser,
  }>,
  parent?: IIssue,

  history: Array<{
    des: {
      [key: string]: string,
    },
    time: number,
    from?: string,
    to?: string,
    typeUpdate?: EIssueHistoryType
  }>
}