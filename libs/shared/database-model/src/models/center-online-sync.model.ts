import { Schema, Document, model, models } from 'mongoose';
import { ICenterOnlineData } from '@beta-titan/shared/data-types'

const CenterOnlineRawDataSchema: Schema = new Schema({
  id: {type: Number, required: true, unique: true },
  data: {type: Object, required: false, default: {} },
}, { timestamps: {} });

export type ICenterOnlineDataMongoose = ICenterOnlineData & Document
const m = () => model<ICenterOnlineDataMongoose>('CenterOnlineRaw', CenterOnlineRawDataSchema)
export const CenterOnlineDataModel = (models.CenterOnlineRaw || m()) as ReturnType<
typeof m
>
