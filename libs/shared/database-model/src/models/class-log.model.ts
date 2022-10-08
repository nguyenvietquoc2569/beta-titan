import { Schema, Document, model, models } from 'mongoose';
import { IClassLog } from '@beta-titan/shared/data-types'

const ClassLogSchema: Schema = new Schema({
  codeMD5: {type: String, required: true, default: '', unique: true},
  checkins: {type: [{
    code: {type: String, required: true},
    timePoint: {type: Number, required: true},
    cameraName: {type: String, required: true},
    manuallyCheckBy: {
      type: Schema.Types.ObjectId,
      ref: 'StaffUser',
      required: false,
      default: null
    }
  }], required: false, default: [] },

  unCheckinNotes: {
    type: [{
      code: {type: String, required: true},
      note: {type: String, required: false, default: ''},
      time: {type: Number, required: false, default: 0},
      commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'StaffUser',
        required: false,
        default: null
      }
    }],
    required: false, default:[]
  },

  studentInClassCodes: {type: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  }], required: false, default:[]},

  teachers: {type: [
    {
      type: Schema.Types.ObjectId,
      ref: 'People',
      required: false,
      default: null
    }
  ], required: false, default: []},

  cameraCheckInId: [{ type: String, required: false, default: ''}],

  comments: {type: [{
    people: {
      type: Schema.Types.ObjectId,
      ref: 'People',
      required: true,
      default: null
    },
    date: {type: Number, required: true},
    content: {type: Number, required: true, default: ''}
  }], required: false, default:[]},

  notes: {type: String, required: false, default: ''},

  audioLogs: {type: [{
    type: String, required: true
  }], required: false, default:[]},
  
  onlineRoom: {
    type: Object, required: false, default: null
  }
})
export type IClassLogMongoose = IClassLog & Document
export const ClassLogModel = models.ClassLog || model<IClassLogMongoose>('ClassLog', ClassLogSchema);
