import { Schema, Document, model, models } from 'mongoose';
import { ITagPeople } from '@beta-titan/shared/data-types'

const TagPeople: Schema = new Schema({
  fullname: {type: String, required: false, default: '' },
  dob: {type: String, required: false, default: '' },
  code: {type: String, required: false, default: '' },
  type: {type: Array, required: false, default: [] },
  phone: {type: String, required: false, default: '' },
  people: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false
  },
  taggedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  faceImages: {type: Array, required: false, default: [] },
}, { timestamps: {} });

export type ITagPeopleMongoose = ITagPeople & Document
const m = () => model<ITagPeopleMongoose>('TagPeople', TagPeople);
export const TagPeopleModel = (models.TagPeople || m()) as ReturnType<typeof m>
