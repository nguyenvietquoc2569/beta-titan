import { Schema, Document, model, models } from 'mongoose';
import { IFaceHanetData, IKnownFaceModel, IStaffUser } from '@beta-titan/shared/data-types'
import { ObjectId } from 'mongodb';

const KnowFaceDataSchema: Schema = new Schema({
  tagData: { type: Object, required: true },
  comments: {type: Array, required: true},
  arcfaces: {type: Array, required: true },
  cusType:  {type: Array, required: false, default: null},
  taggedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    default: null
  },
}, { timestamps: {} });

export type IKnownFaceModelMongoose = IKnownFaceModel & Document

const m = () => model<IKnownFaceModelMongoose>('KnownFaceData', KnowFaceDataSchema)
export const KnownFaceDataModel = (models.KnownFaceData || m()) as ReturnType<typeof m>
