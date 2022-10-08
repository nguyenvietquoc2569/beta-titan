import { IStaffUser } from "../../";
import { IPeople } from "../../legacy";
import { ICenter } from "../center";
import { ILogAction } from "../log";
export enum EMultimediaStatus {
  NEW = 'NEW',
  REQUESTEDAPPROVAD = 'REQUESTEDAPPROVAD',
  APPROVAL = 'APPROVAL',
  ACHIEVED = 'ACHIEVED',
  EDITTED = 'EDITTED',
}
export interface IMultiMedia {
  _id?: string,
  description?: string,
  backblazeRep: {
    [key: string]: any
  },
  backblazeUrl?: string,
  cloudflazeUrl?: string,
  bunnyUrl?: string,
  uploadedBy?: IStaffUser,
  isPublic?: boolean,
  isApprovedBy?: IStaffUser,
  inThisMedia: Array<IPeople>,
  uploadDate: number,
  logs: Array<ILogAction>,
  status: EMultimediaStatus,
  comments: Array<{
    time: number,
    commentedBy: IStaffUser,
    note: string
  }>,
  center?:ICenter,
  asignee?: IStaffUser,
  hashTags: Array<string>
  createdAt?: Date
}