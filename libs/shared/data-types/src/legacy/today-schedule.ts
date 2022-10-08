import { IPeople } from "./people";
import { IStaffUser } from "./staff-user-type";

export interface ISTClass {
  active_classroom: {
    id: number,
    fullname: string,
    overrideRoom: string
  },
  active_teachers: Array<{
    id: number,
    code: string,
    people?: IPeople
  }>,
  start_time: string,
  end_time: string,
  startTime?: number,
  endTime?: number,
  students: Array<{code: string, people?: IPeople}>
  timetableMD5?: string,
  class_id: number,
  id: number,
  date?: string,
  replacementRoom?: ISTOverrideRoom
}
export interface ISTCourse {
  id?: number,
  code?: string,
  fullname?: string,
  timetables?: Array<ISTClass>
}

export interface ISTOverrideRoom {
  addedBy?: IStaffUser,
  roomName?: string,
  timetableMD5: string
}
