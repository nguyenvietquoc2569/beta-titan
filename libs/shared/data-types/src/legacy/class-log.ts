import { IPeople } from "./people";
import { IStaffUser } from "./staff-user-type";

export interface IClassLogCheckin {
  code: string,
  timePoint: number,
  cameraName: string,
  manuallyCheckBy?: IStaffUser
}
export interface IClassLogComment {
  people: IPeople,
  date: number,
  content: string
}

export interface IClassLogUncheckinNote {
  code: string,
  note: string,
  commentedBy: IStaffUser,
  time: number
}

export interface IClassMeetingRoom {
  joinUrl: string,
  subject: string,
  meetingAttendanceReport: object,
  startDateTime: string,
  endDateTime: string,
  id: string
}

export interface IClassLog {
  codeMD5: string,
  checkins: Array<IClassLogCheckin>,
  unCheckinNotes?: Array<IClassLogUncheckinNote>,
  studentInClassCodes: Array<IPeople>,
  teachers: Array<IPeople>,
  cameraCheckInId?: Array<string>,
  audioLogs: Array<string>,
  comments: Array<IClassLogComment>,
  notes?: string,
  onlineRoom?: IClassMeetingRoom
}

export const IClassLogDefault: IClassLog  = {
  codeMD5: '',
  checkins: [],
  unCheckinNotes: [],
  studentInClassCodes: [],
  teachers: [],
  audioLogs: [],
  comments: [],
  notes: ''
}