import { Schema, Document, model, models } from 'mongoose';
import { ICenter } from '@beta-titan/shared/data-types'
const CenterSchema: Schema = new Schema({
  code: {type: String, required: true},
  name: {type: String, required: true},
  eName: {type: String, required: true},
  address: {type: String, default: '', required: false},
  phone: {type: String, default: '', required: false},
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false
  },
  deactive: { type: Boolean, required: false, default: false}
}, { timestamps: {} });

export type ICenterMongoose = ICenter & Document
export const CenterModel = models.Center || model<ICenterMongoose>('Center', CenterSchema);
