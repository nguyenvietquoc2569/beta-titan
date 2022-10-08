import { addRuleToIAuthUrlConfig, getCenterTreeForUser, notificationGenerate, withAuthMiddle, withParamCheck, withSession, withUserParse } from '@beta-titan/ledger/services/shared/midleware'
import { ArticleModel, getBlazeAuthToken, GroupModel, LogActionModel, MultiMediaModel, StaffLoginSessionModel, StaffModel } from '@beta-titan/shared/database-model'
import { ELoginRole,EMultimediaStatus, EPermission, EUserPermissions, IArticle, IMultiMedia, IStaffLoginSession } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { EditorState } from 'draft-js';
import { convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js';
import axios from "axios"
import { getEnvConfig } from '@beta-titan/shared/utilities';

const apiMethodName = 'b2_authorize_account';

addRuleToIAuthUrlConfig('/api/v1/multimedia/approve', {
  requiredLoginSession: true,
  permissions: (p: Array<EPermission>) => {
    return p.includes(EPermission.MULTIMEDIAAPPROVER) || p.includes(EPermission.GLOBAL)
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

  const {_id}: {_id: string, m: IMultiMedia} = req.body

  let media = await MultiMediaModel.findOne({
    _id: new ObjectId(_id)
  })
  if (!media) {
    res.status(200).json({
      error: {
        vi: 'Không tìm thấy file đa phương tiện này',
        en: 'Can not find this Item'
      }
    })
    return
  }

  media.status = EMultimediaStatus.APPROVAL
  media.isApprovedBy = _loginSession.user

  const nLog = new LogActionModel({
    time: new Date().getTime(),
    center: _loginSession.workingCenter,
    des: {
      vi: `${_loginSession.user.username} đã duyệt media ${media._id.toString()}`,
      en: `${_loginSession.user.username} approved media ${media._id.toString()}`,
    },
    createdBy: _loginSession.user
  })

  await nLog.save()

  media.logs.push(nLog)


  await media.save()

  media = await MultiMediaModel.findOne({
    _id: new ObjectId(_id)
  })
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
    .lean()

  // await notificationGenerate({
  //   title: {
  //     vi: 'Approval',
  //     en: 'Multimedia đã Duyệt'
  //   },
  //   des: {
  //     vi: 'aaskdjaskdj was approved',
  //     en: 'aaskdjaskdj was approved en'
  //   },
  //   url: '#upload/sdjskdjh',
  //   searchKey: `beta-notifications-5ff7c50f2caa82a41dff87c8-abcdjhdf`
  // })
  

  res.status(200).json({
    error: null,
    data: media
  })
}))), ['_id'])