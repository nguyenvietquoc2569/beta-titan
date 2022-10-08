
import { Schema, Document, model, models } from 'mongoose';
import { IAutoId } from '@beta-titan/shared/data-types'

const AutoIdSchema: Schema = new Schema({
  id: {type: String, required: true, unique: true},
  count: {type: Number, required: true},
}, { timestamps: {} });

export type IAutoIdMongoose = IAutoId & Document
const m = () => model<IAutoIdMongoose>('AutoId', AutoIdSchema)
export const AutoIdModel = (models.AutoId || m()) as ReturnType<
  typeof m
>
