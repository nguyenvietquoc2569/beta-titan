import { Schema, Document, model, models } from 'mongoose';
import { IMultiMedia } from '@beta-titan/shared/data-types'
const MultiMediaSchema: Schema = new Schema({
  description: {type: String, required: false},
  backblazeRep: {type: Object, required: false},
  backblazeUrl: {type: String, required: false},
  cloudflazeUrl: {type: String, required: false},
  bunnyUrl: {type: String, required: false},
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  isPublic: {type: Boolean, required: true},
  isApprovedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  inThisMedia: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false
  }],
  uploadDate: {type: Number, required: true},
  hashTags: [{type: String, required: true}],
  logs: [{
    type: Schema.Types.ObjectId,
    ref: 'LogAction',
    required: false
  }],
  status: {type: String, required: true},
  comments: {
    type: [{
      note: {type: String, required: false, default: ''},
      time: {type: Number, required: false, default: 0},
      commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'StaffUser',
        required: false,
        default: null
      }
    }],
    required: false, default:[]
  },
  asignee: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  center: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false
  },
}, { timestamps: {} });

export type IMultiMediaMongoose = IMultiMedia & Document
export const MultiMediaModel = models.MultiMedia || model<IMultiMediaMongoose>('MultiMedia', MultiMediaSchema);
