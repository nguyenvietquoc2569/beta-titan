import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ArticleModel, getBlazeAuthToken, GroupModel, LogActionModel, MultiMediaModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EMultimediaStatus, EPermission, EUserPermissions, IArticle, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { EditorState } from 'draft-js';
import { convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js';
import axios from "axios"
import { getEnvConfig } from '@beta-titan/shared/utilities';

const apiMethodName = 'b2_authorize_account';

addRuleToIAuthUrlConfig('/api/v1/multimedia/new-multimedia', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.MULTIMEDIAUPLOAD) || p.includes(EPermission.GLOBAL)
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

  const {fileUrl} = req.body

  const media = new MultiMediaModel({
    description: '',
    uploadedBy: _loginSession.user,
    isPublic: false,
    isApprovedBy: undefined,
    inThisMedia: [],
    uploadDate: new Date().getTime(),
    status: EMultimediaStatus.NEW,
    hashTags: ['_'],
    center: _loginSession.workingCenter,
    backblazeUrl: `${getEnvConfig('multimediaOriginalURL') as string}${fileUrl}`,
    cloudflazeUrl:`${getEnvConfig('multimediaCloudFlareURL') as string}${fileUrl}`,
    bunnyUrl: `${getEnvConfig('multimediaBunnyUrl') as string}${fileUrl}`,
    logs: [],
    comments: []
  })
  
  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã tạo một media và upload file ${fileUrl}`,
      en: `${_loginSession.user.username} created media and uploaded file ${fileUrl}`,
    },
    createdBy: _loginSession.user
  })

  await nLog.save()

  media.logs.push(nLog)

  await media.save()

  res.status(200).json({
    error: null,
    data: media
  })
}))), ['fileUrl'])