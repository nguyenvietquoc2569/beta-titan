import { Document } from 'mongoose';
import { IMedia, MediaDefault } from './media-type';
import { IStaffUser } from './staff-user-type';

export enum EQuestionType {
  OPTION,
  MULTICHOICE,
  DROPBOX,
  TEXTBOX
}

export enum EProblemCategory {
  LISTENNING = 'LISTENNING',
  READING = 'READING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  GRAMMAR = 'GRAMMAR',
}

export const ProblemCategoryList = [EProblemCategory.LISTENNING, EProblemCategory.READING, EProblemCategory.SPEAKING, EProblemCategory.WRITING, EProblemCategory.GRAMMAR]

export interface IAnswer {
  [key: string]: Array<string>
}

export interface IProblemScore {
  [key: string]: number,
  total: number
}

export interface IQuestion  {
  id: string,
  type: EQuestionType,
  numberOfOptions: number,
  anwsers: Array<any>,
  options: Array<any>,
  name: string,
  point: number,
  exactAnwser: boolean
}

export enum EApproveStatus {
  UNAPPROVED= 'UNAPPROVED',
  APPROVED = 'APPROVED',
  NEEDWORK = 'NEEDWORK'
}

export interface IProblem {
  questions: Array<IQuestion>,
  tags: Array<string>,
  category: EProblemCategory
  idCount: number,
  htmlMakeUp: string,
  medias: Array<IMedia>,
  approveStatus: EApproveStatus,
  createdBy?: any,
  editedBy?: any,
  activeOrDeBy?:any,
  isActive: boolean
  totalPoint?: number,

  isSpeaking: boolean,
  speakingPoint?: number,
}

export const defaultProblem: IProblem = {
  questions: [],
  tags: ['betaschool',],
  idCount: 0,
  category: EProblemCategory.GRAMMAR,
  htmlMakeUp: '<p>this is question</p>',
  medias: [],
  approveStatus: EApproveStatus.UNAPPROVED,
  isActive: true,
  isSpeaking: false
}

export const defaultQuestion: IQuestion = {
  id: '',
  type: EQuestionType.OPTION,
  numberOfOptions: 2,
  anwsers: [],
  options: [],
  name: '',
  point: 1,
  exactAnwser: true
}

export function checkAQuestionValid (question: IQuestion): Array<string> {
  let errs = []
  if (question.type === EQuestionType.OPTION || question.type === EQuestionType.MULTICHOICE) {
    if (question.anwsers.length === 0) {
      errs.push('Anwsers can not be empty / thiếu đáp án')
    }
    if (question.anwsers.filter(value => (question.numberOfOptions <= value)).length > 0) {
      errs.push('anwsers are out of range / đáp án không phù hợp')
    }
  }
  if (question.type === EQuestionType.DROPBOX) {
    if (question.options.length === 0) {
      errs.push('Options can not be empty / Thiếu lựa chọn')
    }
    if (question.anwsers.filter(value=>(!question.options.includes(value))).length !== 0) {
      errs.push('anwser is not in option / đáp án không xuất hiện trong lựa chọn')
    }
    if (question.anwsers.length === 0) {
      errs.push('Anwsers can not be empty / thiếu đáp án')
    }
  }
  if (question.type === EQuestionType.TEXTBOX) {
    if (question.anwsers.length === 0) {
      errs.push('Anwsers can not be empty / thiếu đáp án')
    }
  }
  return errs
}

