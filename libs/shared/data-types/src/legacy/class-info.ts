import { IPeople } from "./people";

export interface IClassInfoRaw {
  id: Number,
  code: string,
  fullname: string,
  number_of_session: Number,
  status: Number,
  number_of_hours: Number,
  open_at: string,
  close_at: string,
  students: Array<{
    "id": Number,
    "code": string,
  }>,
  teachers: Array<{
    "id": Number,
    "code": string,
  }>
}

export interface IClassInfo {
  _id: string,
  id: Number,
  code: string,
  fullname: string,
  number_of_session: Number,
  status: Number,
  number_of_hours: Number,
  open_at: Number,
  close_at: Number,
  students: Array<IPeople>,
  teachers: Array<IPeople>,
  microsoftEntity: {
    displayName: string,
    classCode: string,
    id: string
  }
}