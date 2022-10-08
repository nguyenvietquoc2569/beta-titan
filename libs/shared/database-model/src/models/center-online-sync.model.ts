import { Schema, Document, model, models } from 'mongoose';
import { ICenterOnlineData } from '@beta-titan/shared/data-types'

const CenterOnlineRawDataSchema: Schema = new Schema({
  id: {type: Number, required: true, unique: true },
  data: {type: Object, required: false, default: {} },
}, { timestamps: {} });

export type ICenterOnlineDataMongoose = ICenterOnlineData & Document
export const CenterOnlineDataModel = models.CenterOnlineRaw || model<ICenterOnlineDataMongoose>('CenterOnlineRaw', CenterOnlineRawDataSchema);
