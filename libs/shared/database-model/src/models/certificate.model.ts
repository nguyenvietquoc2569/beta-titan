import { Schema, Document, model, models } from 'mongoose';
import { ICertificate } from '@beta-titan/shared/data-types'

const CertificateSchema: Schema = new Schema({
  studenInfo: {type: Object, required: true},
  certType: {type: String, required: true},
  dateOfIssue: {type: Number, required: false, unique: false },
  dateOfRequest: {type: Number, required: true, unique: false },
  signedBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  },
  rejectedBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  },
  requestBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  },
  certNumber: {type: String, required: true},
  active: {type: Boolean, remove: true},

  sourceTest: {
    type: Schema.Types.ObjectId,
    ref: 'BetaTest',
    required: false,
    default: null
  },
  thumbnail: {type: String, required: false, default: ''},
  thumbnailSpeaking: {type: String, required: false, default: ''},

  smsTimeStampSent: {type: Number, required: false, default: ''},
  smsSentBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  }
}, { timestamps: {} });

export type ICertificateMongoose = ICertificate & Document
const m = () => model<ICertificateMongoose>('Certificate', CertificateSchema)
export const CertificateModel = (models.Certificate || m()) as ReturnType<
typeof m
>;
