import { IStaffUser } from "./staff-user-type";
import { IBetaTest, IStudent } from "./test-type";

export enum ECertificateType {
  testResult = 'Test Result',
  courseComplete = 'Course Complete',
}

export interface ICertificate {
  studenInfo: IStudent,
  certType: ECertificateType,
  dateOfIssue: number,
  dateOfRequest: number,
  signedBy?: IStaffUser,
  rejectedBy?: IStaffUser, 
  requestBy: IStaffUser,
  certNumber: string,
  active: boolean,

  sourceTest?: IBetaTest,

  thumbnail?: string,
  thumbnailSpeaking?: string,

  smsTimeStampSent?: number,
  smsSentBy?: IStaffUser
}