import { IStaffUser } from '@beta-titan/shared/data-types';
import { CenterModel, HistoryModel, PeopleModel } from '@beta-titan/shared/database-model'
import { EBasicGroup, ELabelHistory, EPermission, ICenter, IHistory, IPeople } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';
import { groupCreate } from '../groups/group-create';
import { writeHistory } from '../history/history-log';

export async function centerCreate(center: ICenter, implementer?: IStaffUser) {
  const _center = new CenterModel(center)
  await _center.save()

  await groupCreate({
    _id: '',
    name: EBasicGroup.STAFFGROUP,
    center: _center,
    permissions: [EPermission.BLANK],
    logs: []
  }, implementer)

  await writeHistory({
    staff1: implementer,
    center: _center,
    des: {
      vi: `${implementer ? (implementer?.name + '(' + implementer?.emailid + ')') : ''} đã tạo trung tâm: ${center.name}`,
      en: `${implementer ? (implementer?.name + '(' + implementer?.emailid + ')') : ''} created center: ${center.eName}`,
    },
    time: new Date().getTime(),
    label: ELabelHistory.CREATECENTER
  })
  return _center
}