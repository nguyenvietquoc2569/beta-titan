import { Schema, Document, model, models } from 'mongoose';
import { IArticle, ICenter, ILogAction } from '@beta-titan/shared/data-types'
const ArticleSchema: Schema = new Schema({
  title:  {type: String, required: true},
  html:  {type: String, required: false},
  thumb:  {type: String, required: false},
  hashtags: [{type: String, required: true}],
  files: [{type: String, required: false}],

  date: {type: Number, required: true},
  updatedDate: {type: Number, required: false},
  order: {type: Number, required: false},
  logs: [{
    type: Schema.Types.ObjectId,
    ref: 'LogAction',
    required: false
  }],
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
}, { timestamps: {} });

export type IArticleMongoose = IArticle & Document
const m = () => model<IArticleMongoose>('Article', ArticleSchema);
export const ArticleModel =(models.Article || m()) as ReturnType<typeof m>
