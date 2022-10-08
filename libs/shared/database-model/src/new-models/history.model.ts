import { Schema, Document, model, models } from 'mongoose';
import { IHistory } from '@beta-titan/shared/data-types'
const HistorySchema: Schema = new Schema({
  
  center: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false
  },people1: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false
  },
  people2: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false
  },
  staff1: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  staff2: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  implementer: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false
  },
  des: {
    type: Object,
    required: false, default: {}
  },
  time: {
    type: Number,
    required: false, default: 0
  },
  label: {
    type: String,
    required: false, default: 0
  },
}, { timestamps: {} });

export type IHistoryMongoose = IHistory & Document
export const HistoryModel = models.History || model<IHistoryMongoose>('History', HistorySchema);
