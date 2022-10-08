
import { Schema, Document, model, models } from 'mongoose';
import { IPeople } from '@beta-titan/shared/data-types';

const PeopleSchema: Schema = new Schema({
  avatar: {type: String, required: false, default: ''},
  fullname: {type: String, required: true},
  code: {type: String, required: false, default: ''},
  username: {type: String, required: false, default: ''},
  dob: {type: String, required: false, default: ''},
  birthday: {type: Date, required: false},
  phone: {type: String, required: false, default: ''},
  center: {type: Array, required: false, default: []},
  nickname: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  password: {type: String, required: false, default: ''},
  type: {type: Array, required: false, default: []},
  address: {type: String, required: false, default: ''},
  province: {type: String, required: false, default: ''},
  district: {type: String, required: false, default: ''},
  ward: {type: String, required: false, default: ''},
  zalo: {type: String, required: false, default: ''},
  facebook: {type: String, required: false, default: ''},
  supporters: [{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  }],
  coID: {type: Number, required: false, default: -1},
  gender: {type: Number, required: false, default: -1},
  guardians: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  }],
  father: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  mother: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  }],
  sale: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  betaEmail: {type: String, required: false, default: ''},
  betaEmailInitPassword: {type: String, required: false, default: ''},
  microsoftAccount: {type: Object, required: false, default: null},
  microsoftImmutableId: {type: String, required: false, default: ''},
  centers: [{
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: false,
    default: null
  }]
}, { timestamps: {} });

export type IPeopleMongoose = IPeople & Document
const m = () => model<IPeopleMongoose>('People', PeopleSchema)
export const PeopleModel = (models.People || m()) as ReturnType<typeof m>
