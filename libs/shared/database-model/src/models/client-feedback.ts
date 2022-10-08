import { Schema, Document, model, models } from 'mongoose';
import { IClientFeedback } from '@beta-titan/shared/data-types'

const ClientFeedbackSchema: Schema = new Schema({
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false, default: null
  },
  time: {type: Number, required: true},
  tags: {type: Array, required: true, default: []},
  content: {type: String, required: true, default: ''},
  client: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false, default:null
  },
  unlinkClient: {type: Object, required: false, default: null}
})

export type IClientFeedbackMongoose = IClientFeedback & Document
export const ClientFeedbackModel = models.ClientFeedback || model<IClientFeedbackMongoose>('ClientFeedback', ClientFeedbackSchema);

