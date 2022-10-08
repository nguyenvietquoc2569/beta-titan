import { EApproveStatus } from './problem-question-type'
export interface IExam {
  name: string,
  des: string,
  approveStatus: EApproveStatus,
  createdBy?: any,
  editedBy?: any,
  isActive: boolean,
  parts: Array<IExamPart>,
  activeOrDeBy?: any,
  timeForTest: number
}

export interface IExamPart {
  name: string,
  tags: Array<string>,
  totalPoint: number,
  isSpeaking?: boolean
}

export let defaultExamPart: IExamPart = {
  name: '',
  tags: [],
  totalPoint: 0,
  isSpeaking: false
}

export let defaultExam: IExam = {
  name: '',
  des: '',
  isActive: true,
  approveStatus: EApproveStatus.UNAPPROVED,
  parts: [],
  timeForTest: 1.5
}

