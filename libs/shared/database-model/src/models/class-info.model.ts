import { Schema, Document, model, models } from 'mongoose';
import { IClassInfo } from '@beta-titan/shared/data-types'

const ClassInfoSchema: Schema = new Schema({
  id: { type: String, required: true, default: ''},
  code: { type: String, required: true, default: ''},
  fullname: { type: String, required: true, default: ''},
  number_of_session: { type: Number, required: true, default: 0},
  status: { type: Number, required: true, default: 0},
  number_of_hours: { type: Number, required: true, default: 0},
  open_at: { type: Number, required: true, default: 0},
  close_at: { type: Number, required: true, default: 0},
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false, default:null
  }],
  teachers: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false, default:null
  }],
  microsoftEntity: { type: Object, required: true, default: 0}
})

export type IClassInfoMongoose = IClassInfo & Document
const m = () => model<IClassInfoMongoose>('ClassInfo', ClassInfoSchema)
export const ClassInfoModel = (models.ClassInfo || m()) as ReturnType<
  typeof m
>

