import { Schema, Document, model, models } from 'mongoose';
import { IGroup } from '@beta-titan/shared/data-types'
const GroupSchema: Schema = new Schema({
  name: {type: String, required: true},
  center: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false
  },
  permissions: [{type: String, required: true}],
  logs: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: false
  }]
}, { timestamps: {} });

export type IGroupMongoose = IGroup & Document
const m = () => model<IGroupMongoose>('Group', GroupSchema)
export const GroupModel = (models.Group || m()) as ReturnType<typeof m>;
