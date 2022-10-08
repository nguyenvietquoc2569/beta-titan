import { IStaffUser } from '@beta-titan/shared/data-types';
import { Schema, Document, model, models } from 'mongoose';

const StaffSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true },
  ename: {type: String, required: false, unique: false, default: '' },
  username: { type: String, required: true, unique: true },
  password: {type: String, required: true, unique: false },
  emailid: { type: String, required: true, unique: true },
  permissions: { type: Array, required: true },
  active: {type: Boolean, remove: true},
  title: { type: String, required: false, default: ''},
  linkPeople: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser'
  },
  groups: [{type: Schema.Types.ObjectId, required: false, ref: 'Group' }],
  preferCenter:{
    type: Schema.Types.ObjectId,
    ref: 'Center'
  },
  avatar: { type: String, required: false },
  taskboardAvatar: {type:  String, required: false}
}, { timestamps: {} });

export type IStaffUserMongoose = IStaffUser & Document
const m = () => model<IStaffUserMongoose>('StaffUser', StaffSchema)
export const StaffModel = (models.StaffUser || m()) as ReturnType<typeof m>
