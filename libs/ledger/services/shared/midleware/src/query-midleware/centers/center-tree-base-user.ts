import { CenterModel, StaffModel } from '@beta-titan/shared/database-model'
import { EPermission, ICenter, ICenterCodeTree, IGroup } from '@beta-titan/shared/data-types';
import { ObjectId } from 'mongodb';

let cacheCenter: ICenterCodeTree = {
  code: '',
  children: []
}
let cacheTime = 0

export async function getAllCenter () {
  if (new Date().getTime() - cacheTime < 4000) {
    return cacheCenter
  } 
  const root = await CenterModel.findOne({parent: null})
  const node: ICenterCodeTree = {
    code: root.code,
    mongoObject: root.toObject(),
    children: []
  }

  const stack : Array<ICenterCodeTree> = [node]

  while (stack.length !==0) {
    const n = stack.pop() || {
      code: '',
      children: []
    }
    const items = await CenterModel.find({parent: n?.mongoObject, deactive: {$ne: true }})
    n.children = items.map(i => ({
      code: i.code,
      mongoObject: i,
      children: []
    }))
    stack.push(...n?.children) // eslint-disable-line
  }

  cacheCenter = node
  cacheTime = new Date().getTime()

  return node
}

export async function getCenterTreeForUser (userMongoId: string) {
  const people = await StaffModel.findOne({_id: new ObjectId(userMongoId), deactive: {$ne: true }})
    .populate('groups')
    .populate({path: 'groups', populate: 'center'})

  const centerCodes = people.groups.map((group: IGroup) => group.center.code)
  const orgNode = await getAllCenter()

  const re = []

  const stack : Array<ICenterCodeTree> = [orgNode]
  while (stack.length !==0) {
    const n = stack.pop() || {
      code: '',
      children: []
    }
    if (centerCodes.includes(n.code)) {
      re.push(n)
    } else {
      stack.unshift(...(n?.children)) // eslint-disable-line
    }
  }

  return re
}
