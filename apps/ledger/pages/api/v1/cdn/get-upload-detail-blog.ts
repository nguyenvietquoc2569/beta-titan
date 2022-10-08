import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ArticleModel, getBlazeAuthToken, GroupModel, LogActionModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IArticle, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { EditorState } from 'draft-js';
import { convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js';
import axios from "axios"
import { getEnvConfig } from '@beta-titan/shared/utilities';

const apiMethodName = 'b2_authorize_account';

addRuleToIAuthUrlConfig('/api/v1/cdn/get-upload-detail-blog', {
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
  const { apiUrl, authToken} = await getBlazeAuthToken()
  
  const getUploadRes = await axios({
    method: 'POST',
    url: `${apiUrl}/b2api/v2/b2_get_upload_url`,
    headers: {
        'Authorization': authToken,
    },
    data: {
      bucketId: getEnvConfig('blogb2BucketId') as string,
    },
  });

  const data = getUploadRes.data;
  const uploadUrl = data.uploadUrl;

  res.status(200).json({
    error: null, data: {
      authToken: data.authorizationToken, // upload auth token, not account auth token
      uploadUrl,
    },
  })
}))), [])