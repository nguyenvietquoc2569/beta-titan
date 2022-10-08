import { Schema, Document, model, models } from 'mongoose';
import { IExam } from '@beta-titan/shared/data-types'

const ExamSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true },
  des: { type: String, required: true },
  parts: {type: Array, required: true},
  approveStatus: { type: String, required: true},
  timeForTest: {type: Number, required: true},
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser'
  },
  approveStatusChangedBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false, default: null
  },
  editedBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    default: null
  },
  isActive: {type: Boolean, required: true, default: true}

}, { timestamps: {} });

export type IExamMongoose = IExam & Document
export const ExamModel = models.Exam || model<IExamMongoose>('Exam', ExamSchema);

//---- test

