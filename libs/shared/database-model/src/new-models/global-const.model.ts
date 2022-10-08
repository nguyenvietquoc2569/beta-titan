import { Schema, Document, model, models } from 'mongoose';
import { IGlobalConst } from '@beta-titan/shared/data-types'
const GlobalConstSchema: Schema = new Schema({
  ticketCount: {type: Number, required: true},
}, { timestamps: {} });

export type IGlobalConstMongoose = IGlobalConst & Document
const m = () => model<IGlobalConstMongoose>('GlobalConst', GlobalConstSchema)
export const GlobalConst = (models.GlobalConst || m()) as ReturnType<typeof m>;
