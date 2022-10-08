import { ICertificate } from "./certificate";
import { IExam } from "./exam-type";
import { IMedia } from "./media-type";
import { IAnswer, IProblem } from "./problem-question-type";
import { IStaffUser } from "./staff-user-type";


export enum eBetaTestStatus {
  JUSTCREATED = 'JUST CREATED',
  CHECKIN = 'CHECKIN',
  STARTED = 'STARTED',
  DONE = 'DONE',
  WAITFORAPPROCVECERT = 'Wait For Approving Cert',
  ISSUEDCER = 'Issued Cert'
}

export interface IStudent {
  name: string,
  phone: string,
  dateOfBirth: string,
  coID?: string
}

export interface IBetaTest {
  createdBy?: IStaffUser,
  studenInfo: IStudent,
  exam?: IExam,
  problems?: Array<IProblem>,
  anwsers?: Array<IAnswer>
  status?: eBetaTestStatus,
  startedTime?: number,
  completeTime?: number,
  code?: string,
  score?: number,
  star?: number,
  feedback?: string,

  speakingProblems?: Array<IProblem>,
  scoreSpeaking?: Array<number>,
  speakingTestedBy?: IStaffUser,
  speakingRecords?: Array<IMedia>,
  speakingComments?: string,

  certificate?: ICertificate
}

export let defaultBetaTest: IBetaTest = {
  studenInfo: {
    name: '',
    phone: '',
    dateOfBirth: '',
    coID: '',
  },
  exam: null,
  status: eBetaTestStatus.JUSTCREATED,

  speakingProblems: [],
  scoreSpeaking: [],
  speakingTestedBy: null,
  speakingRecords: [],
  speakingComments: ''
}