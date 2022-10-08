import { IPeople, IStaffUser } from "..";
import { ICenter } from "./center";
import { IGroup } from "./group";

export enum ELabelHistory {
  CHANGECENTERLOGO = 'CHANGE CENTER LOGO',
  CREATECENTER = 'CREATE CENTER',
  CREATEGROUP = 'CREATE GROUP',
  SELFPASSWORDCHANGE = 'SELF PASSWORD CHANGE',
  CREATEACCOUNTSTUDENT = 'CREATE STUDENT ACCOUNT',
  CREATEACCOUNTTEACHER = 'CREATE TEACHER ACCOUNT',
  CREATEEXAMPERMISION = 'CREATE EXAM PERMISSION',
  EXAMPERMISIONEDIT = 'EXAM PERMISSION EDIT',
  CREATENEWPROBLEM = 'CREATE NEW PROBLEM',
  EDITPROBLEM = 'PROBLEM EDIT',
  CREATENEWEXAM = 'CREATE NEW EXAM',
  EDITEXAM = 'EXAM EDIT',
}

export interface IHistory {
  center?: ICenter,
  people1?: IPeople,
  people2?: IPeople,
  staff1?: IStaffUser,
  staff2?: IStaffUser,
  implementer?: IPeople,
  des?: { [key: string]: string},
  group?: IGroup,
  time: number,
  label: ELabelHistory,
}