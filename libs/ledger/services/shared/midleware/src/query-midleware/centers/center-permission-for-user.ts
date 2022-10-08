
import { StaffModel, CenterModel } from '@beta-titan/shared/database-model';
import { EPermission, ICenter, IGroup } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

export async function getCenterPermissionForUser (userId: string, centerCode: string): Promise<{
  center: ICenter | null,
  permissions: Array<EPermission>
}> {
  if (centerCode === '') {
    return {
      center: null,
      permissions: []
    }
  }
  const people = await StaffModel.findOne({_id: new ObjectId(userId), deactive: {$ne: true }})
    .populate({path: 'groups', populate: {path: 'center', populate:['parent']}})

  const groups: Array<IGroup> = people.groups

  const center = await CenterModel.findOne({code: centerCode, deactive: {$ne: true }}).
    populate('parent')

  if (!center) {
    return {
      center: null,
      permissions: []
    }
  }

  const permissions: Set<EPermission> = new Set()
  let c = center.toObject()
  
  while (c) {
    const _groups = groups.filter(g => g.center.code===c.code)
    for(const group of _groups) {
      if (group) {
        for (const p of group.permissions) {
          permissions.add(p)
        }
      }
    }
    
    c = (!c.parent) ? null : (await CenterModel.findOne({_id: new ObjectId(c.parent._id), deactive: {$ne: true }})
      .populate('parent')).toObject()
  }

  // console.log(userId, centerCode, permissions)

  return {
    center: (permissions.size === 0) ? null : center.toObject(),
    permissions: Array.from(permissions)
  }
}