import { v4 as uuidv4 } from 'uuid'
import { IStaffUser } from '../staff-user-type'

export interface IFaceExtractionData {
  vec: Array<number>,
  facedata: string,
  gender: number,
  age: number,
  prob: number,
  norm: number,
  mask_prob: null | any,
  hashFaceData: string
}

export enum eFacingQueryingInDatabase {
  NOTSTARTED = 'notStarted',
  QUERYING = 'querying',
  DONE = 'done'
}

export enum eFaceTypeOfCustomer {
  BETASCHOOLSTUDENTS = 'Học Sinh BetaSchool',
  BETASCHOOLPARENT = 'Phụ Huynh BetaSchool',
  BETASCHOOLSTAFF = 'Nhân Viên BetaSchool',
  NHUQUYNHCUSTOMER = 'Khách Hàng Nội Thất Như Quỳnh',
  OTHERs = 'Khác',
}

export interface IFaceTagData {
  coMeta: any,
  nqMeta: any,
  cusType: eFaceTypeOfCustomer | null,
  nameDisplay: string,
}

export const faceTagDataDefault: () => IFaceTagData  = () => {
  return {
    coMeta: {},
    nqMeta: {},
    nameDisplay: '',
    cusType: null
  }
}

export interface IFaceHanetData {
  hanetServerImageUrl: string,
  selfImageRelativeUrl: string,
  filename: string,
  deviceID: string,
  deviceName: string,
  placeName: string,
  placeID: string,
  time:number,
  arcface: IFaceExtractionData,
  isQueriedInDatabase: eFacingQueryingInDatabase,
  idIKnownFace?: IKnownFaceModel | string | null
}

export interface IKnownFaceModel {
  arcfaces: Array<IFaceExtractionData>,
  tagData?: IFaceTagData | null,
  comments: Array<{
    time: number,
    commentedBy: IStaffUser,
    text: string
  }>,
  taggedBy: IStaffUser | null
}

export const iKnowFaceModelDefault:IKnownFaceModel = {
  arcfaces: [],
  tagData: faceTagDataDefault(),
  comments: [],
  taggedBy: null
}
