import { CenterModel, GroupModel, HistoryModel, PeopleModel } from '@beta-titan/shared/database-model'
import { ELabelHistory, EPermission, ICenter, IGroup, IHistory, IPeople, IStaffUser } from '@beta-titan/shared/data-types';
import { writeHistory } from '../history/history-log';

export async function groupCreate (group: IGroup, implementer?: IStaffUser) {
    if (!group.permissions.includes(EPermission.BLANK)) {
      group.permissions.push(EPermission.BLANK)
    }
    const _group = new GroupModel(group)
    await _group.save()

    await writeHistory({
      staff1: implementer,
      center: group.center,
      group: group,
      des: {
        vi: `${implementer ? (implementer?.name+'('+implementer?.username+')') : ''} đã tạo group ${group.name} tại trung tâm: ${group.center.name}`,
        en: `${implementer ? (implementer?.name+'('+implementer?.username+')') : ''} created group ${group.name} at center ${group.center.eName}`,
      },
      time: new Date().getTime(),
      label: ELabelHistory.CREATEGROUP
    })
    return _group
}