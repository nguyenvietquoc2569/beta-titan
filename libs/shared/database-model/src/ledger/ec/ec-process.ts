
import { Schema, Document, model, models } from 'mongoose';
import { IECProcess } from '@beta-titan/shared/data-types'

const ECProcessSchema: Schema = new Schema({
  assignees: [{
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'StaffUser',
      required: true,
      default: null
    },
    point: {type: Number, required: true},
    datePoint: {type: Date, required: false }
  }],
  center: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
    default: null
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: true,
    default: null
  },
  createdDay: {type: Date, required: false },
  tags: [{type: String, required: true}],
  referer: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  source: {type: String, required: false},
  des: {type: String, required: false},
  comments: [{
    commenter: {
      type: Schema.Types.ObjectId,
      ref: 'StaffUser',
      required: true,
      default: null
    },
    content: {type: String, required: true, default: ''},
    timestamp: {type: Date, required: false }
  }]
}, { timestamps: {} });

export type IECProcessMongoose = IECProcess & Document
export const ECProcessModel = models.ECProcess || model<IECProcessMongoose>('ECProcess', ECProcessSchema);
