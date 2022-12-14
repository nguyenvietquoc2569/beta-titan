import { Schema, Document, model, models } from 'mongoose';
import { IFaceImage, IStaffUser } from '@beta-titan/shared/data-types'
import './tagpeople.model'

const FaceImageSchema: Schema = new Schema({
  hanetServerImageUrl: {type: String, required: true },
  deviceID: {type: String, required: true },
  deviceName: {type: String, required: true },
  placeName: {type: String, required: true },
  placeID: {type: String, required: true },
  time:{type: Number, required: true },

  faceData: {type: String, required: false, default: '' },
  vec: {type: Array, required: false, default: [] },

  isQueriedInDatabase: {type: String, required: false },
  tags: {
    type: Schema.Types.ObjectId,
    ref: 'TagPeople',
    required: false,
    default: null
  },
  otherTags: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TagPeople',
        required: false,
        default: null
      }
    ],
    default: []
  }
}, { timestamps: {} });

export type IFaceImageMongoose = IFaceImage & Document
const m = () => model<IFaceImageMongoose>('FaceImage', FaceImageSchema)
export const FaceImageModel = (models.FaceImage || m()) as ReturnType<typeof m>;

const m1 = () => model<IFaceImageMongoose>('OldFaceImage', FaceImageSchema)
export const OldFaceImageModel = (models.OldFaceImage || m1())as ReturnType<typeof m1>;
