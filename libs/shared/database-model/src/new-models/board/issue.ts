import { Schema, Document, model, models } from 'mongoose';
import { IIssue } from '@beta-titan/shared/data-types'
const IssueSchema: Schema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: 'TaskBoard',
    required: false
  },
  title: {type: String, required: true},
  description: {type: String, required: false},
  type: {type: String, required: false},
  order:{type: Number, required: false},
  code: {type: String, required: false},

  assignees: {
    type: [{
      point: {type: Number, required: true},
      user: {
        type: Schema.Types.ObjectId,
        ref: 'StaffUser',
        required: false,
      },
      note: {type: String, required: false}
    }],
    required: false
  },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  priority: {
    type: String, required: false
  },
  estimateHour: {
    type: Number, required: true
  },

  lastUpdateTime: {
    type: Number, required: true
  },
  createdAt: {
    type: Number, required: true
  },

  attachments: {
    type: [{
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'StaffUser',
        required: false
      },
      link: {type: String, required: true}
    }],
    default: [],
  },

  comments:{
    type: [{
      time: {type: Number, required: true},
      commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'StaffUser',
        required: false,
      },
      note: {type: String, required: false}
    }],
    required: false,
    default: []
  },

  status: {
    type: String, required: false
  },

  statusTransitions: {
    type: [{
      from: {type: String, required: true},
      to: {type: String, required: true},
      time: {type: Number, required: true},
      movedBy: {
        type: Schema.Types.ObjectId,
        ref: 'StaffUser',
        required: false,
      },
    }]
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Issue',
    required: false,
  },
  history: {
    type: [{
      des: {type: Object, required: true},
      time: {type: Number, required: true},
      from: {type: String, required: false},
      to: {type: String, required: false},
      typeUpdate: {type: String, required: false}
    }]
  },
}, { timestamps: {} });

export type IIssueMongoose = IIssue & Document
const m = () => model<IIssueMongoose>('Issue', IssueSchema)
export const IssueModel = (models.Issue || m()) as ReturnType<typeof m>;

