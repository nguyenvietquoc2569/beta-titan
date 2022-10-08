import { Schema, Document, model, models } from 'mongoose';
import { IKanbanBoard } from '@beta-titan/shared/data-types'
const KanbanBoardSchema: Schema = new Schema({
  code: {type: String, required: true},
  workingCenter: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },

  defaultAssignee: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },

  workingStaffs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'StaffUser',
      required: false
    }
  ],
  managers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'StaffUser',
      required: false
    }
  ],
  labels: [{type: Object, required: false}],
  states: [{type: String, required: false}],
  name: {type: String, required: true},
  description:  {type: String, required: true},
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  deactive: { type: Boolean, required: true, default: false},
  logs: [{
    type: Schema.Types.ObjectId,
    ref: 'LogAction',
    required: false
  }],
  logo: { type: String, required: false, default: ''},

}, { timestamps: {} });

export type IKanbanBoardMongoose = IKanbanBoard & Document
export const KanbanBoardModel = models.KanbanBoard || model<IKanbanBoardMongoose>('KanbanBoard', KanbanBoardSchema);
