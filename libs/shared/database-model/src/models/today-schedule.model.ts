import { Schema, Document, model, models } from 'mongoose';
import { ISTOverrideRoom, ITagPeople } from '@beta-titan/shared/data-types'

const STOverrideRoom: Schema = new Schema({
  roomName: {type: String, required: false, default: '' },
  timetableMD5: {type: String, required: false, default: '' },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  }
}, { timestamps: {} });

export type ISTOverrideRoomMongoose = ISTOverrideRoom & Document
export const STOverrideRoomModel = models.STOverrideRoom || model<ISTOverrideRoomMongoose>('STOverrideRoom', STOverrideRoom);
