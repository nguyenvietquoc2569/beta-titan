
import { Schema, Document, model, models } from 'mongoose';
import { ICourse } from '@beta-titan/shared/data-types'

const CourseSchema: Schema = new Schema({
  code: {type: String, required: true},
  name: {type: String, required: true},
  numSession: {type: Number, required: true},
  numHours: {type: Number, required: true, unique: false },
  center:{
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
    default: null
  },
  description: {type: String, required: false},
  price: {type: Number, required: true},
  isActive: {type: Boolean, required: true},
  changeHistory: [{
    changedBy:{
      type: Schema.Types.ObjectId,
      ref: 'StaffUser',
      required: true,
      default: null
    },
    from: {type: Object, required: true},
    to: {type: Object, required: true}
  }]
}, { timestamps: {} });

export type ICourseMongoose = ICourse & Document
export const CourseModel = models.Course || model<ICourseMongoose>('Course', CourseSchema);
