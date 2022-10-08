import { addRuleToIAuthUrlConfig, getCenterTreeForUser, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ArticleModel, getBlazeAuthToken, GroupModel, LogActionModel, MultiMediaModel, PeopleModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole, EPermission, EUserPermissions, IArticle, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { EditorState } from 'draft-js';
import { convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js';
import axios from "axios"
import { getEnvConfig } from '@beta-titan/shared/utilities';

const apiMethodName = 'b2_authorize_account';

addRuleToIAuthUrlConfig('/api/v1/multimedia/get-media-filter', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.MULTIMEDIAUPLOAD) || p.includes(EPermission.MULTIMEDIAAPPROVER) || p.includes(EPermission.GLOBAL)
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

  const { ipp, page, inMediaPerson, status, belongToEC, isPublic, hashTags} = req.body

  // get people belong to EC

  const peopleBelongToEC = (belongToEC && belongToEC.linkPeople) ? (await PeopleModel.find({
    sale: new ObjectId(belongToEC.linkPeople)
  }).lean()) : []

  const inMediaPersons = inMediaPerson ? [inMediaPerson, ...peopleBelongToEC] : peopleBelongToEC

  const conditions = {
    ...((belongToEC || inMediaPerson) ? {inThisMedia: {$in: inMediaPersons} } : {}),
    ...(status ? {status: status} : {}),
    ...(isPublic? {isPublic: isPublic}: {}),
    ...(hashTags ? {hashTags: {$all: hashTags}} : {})
  }

  const mediaModel = MultiMediaModel.find(
    conditions
  )

  const count = await mediaModel.count()

  const media = await MultiMediaModel.find(
    conditions
  )
    .sort({updatedAt: -1, createdAt: -1})
    .skip(page * ipp).limit(ipp)
    .populate('isApprovedBy')
    .populate('logs')
    .populate({
      path: 'comments',
      populate: {
        path: 'commentedBy'
      }
    })
    .populate('asignee')
    .populate('uploadedBy')
    .populate('inThisMedia')
    .populate({
      path: 'inThisMedia',
      populate: {
        path: 'sale'
      }
    })
    .lean()

  

  if (!media) {
    res.status(200).json({
      error: {
        vi: 'Không tìm thấy file đa phương tiện này',
        en: 'Can not find this Item'
      }
    })
    return
  }
  
  res.status(200).json({
    error: null,
    data: media,
    count : count
  })
}))), ['ipp', 'page'])