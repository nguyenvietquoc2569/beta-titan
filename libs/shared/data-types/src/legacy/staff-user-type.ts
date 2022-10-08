import { IGroup } from "..";
import { IPeople } from "./people";

export interface IStaffUser {
  _id?: string,
  name: string,
  username: string,
  ename: string,
  password: string,
  emailid: string,
  permissions: Array<string>,
  active: boolean,
  title?: string,
  linkPeople?: IPeople | null,
  groups?: Array<IGroup>,
  avatar?: string,
  taskboardAvatar?: string
}

export const defaultStaffUser: IStaffUser = {
  name: '',
  username: '',
  ename: '',
  password: '',
  emailid: '',
  permissions: [],
  active: true,
  linkPeople: null,
  avatar: undefined,
  taskboardAvatar: undefined,
}