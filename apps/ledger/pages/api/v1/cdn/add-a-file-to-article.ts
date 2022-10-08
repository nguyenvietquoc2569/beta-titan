import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ArticleModel, getBlazeAuthToken, GroupModel, LogActionModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IArticle, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { EditorState } from 'draft-js';
import { convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js';
import axios from "axios"
import { getEnvConfig } from '@beta-titan/shared/utilities';

const apiMethodName = 'b2_authorize_account';

addRuleToIAuthUrlConfig('/api/v1/cdn/add-a-file-to-article', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return true
  },
  role: [ELoginRole.STAFF]
})

export default withParamCheck(withSession(withUserParse(withAuthMiddle(async (req, res) => {
  const _loginSession: IStaffLoginSession = req.loginSession
  if (!_loginSession) {
    req.loginSession = null
    res.status(403).json({result: 'session end'})
    return
  }
  if (!_loginSession.workingCenter) {
    res.status(403).json({result: 'No Working Center'})
    return
  }

  const {_idArt, fileUrl} = req.body

  let article = await ArticleModel.findOne({_id: new ObjectId(_idArt)})
  
  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã upload file ${fileUrl}`,
      en: `${_loginSession.user.username} uploaded file ${fileUrl}`,
    },
    createdBy: _loginSession.user
  })
  
  const _fileUrl = `${getEnvConfig('blogURLCDN') as string}${fileUrl}`
  article.files.push(_fileUrl)

  await nLog.save()

  article.logs.push(nLog)
  await article.save()

  article = await ArticleModel.findOne({_id: new ObjectId(_idArt)})
    .populate('lastEditedBy')
    .populate('approvedBy')
    .populate('author')
    .populate('logs')
    .lean()

  res.status(200).json({
    error: null,
    data: article
  })
}))), ['_idArt', 'fileUrl'])