import { Schema, Document, model, models } from 'mongoose';
import { IStaffLoginSession } from '@beta-titan/shared/data-types'
const StaffLoginSessionSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  loginTime: {type: Number, required: true},
  reactiveTime: {type: Number, required: true},
  logoutTime: {type: Number, required: false, default: 0},
  role: {type: String, required: true},
  workingCenter: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false
  },
  workingPermision: [{type: String, required: true}],
  legacyToken: {type: String, required: false, default: ''}
}, { timestamps: {} });

export type IStaffLoginSessionMongoose = IStaffLoginSession & Document
export const StaffLoginSessionModel = models.StaffLoginSession || model<IStaffLoginSessionMongoose>('StaffLoginSession', StaffLoginSessionSchema);
