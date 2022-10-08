import { IStaffUser } from "../../legacy";
import { ILogAction } from "../log";
import { RawDraftContentState } from 'draft-js';

export interface IArticle {
  _id?: string,
  title: string,
  html?: string,
  hashtags: Array<string>,
  files: Array<string>,
  thumb?: string,
  
  order: number,
  logs: Array<ILogAction>,
  date: number,
  updatedDate: number,
  lastEditedBy?: IStaffUser,
  author: IStaffUser,
  approvedBy?: IStaffUser,
}