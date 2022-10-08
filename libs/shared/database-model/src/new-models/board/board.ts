import { Schema, Document, model, models } from 'mongoose';
import { ITaskBoard } from '@beta-titan/shared/data-types'
const TaskBoardSchema: Schema = new Schema({
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
    ref: 'Group',
    required: false
  }],
  logo: { type: String, required: false, default: ''},

}, { timestamps: {} });

export type ITaskBoardMongoose = ITaskBoard & Document
export const TaskBoardModel = models.TaskBoard || model<ITaskBoardMongoose>('TaskBoard', TaskBoardSchema);
