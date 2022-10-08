import { Schema, Document, model, models } from 'mongoose';
import { ICenter, ILogAction } from '@beta-titan/shared/data-types'
const LogActionSchema: Schema = new Schema({
  time: {type: Number, required: true},
  des: {type: Object, required: true},
  extraInfo: {type: Object, required: false},
  center: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  }
}, { timestamps: {} });

export type ILogActionMongoose = ILogAction & Document
export const LogActionModel = models.LogAction || model<ILogActionMongoose>('LogAction', LogActionSchema);
