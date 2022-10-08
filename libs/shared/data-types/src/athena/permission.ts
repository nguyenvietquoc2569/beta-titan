export interface IPermissionDes {
  desVN: string,
  desEN: string,
  [key: string]: string
}

export enum EPermission {
  
  BLANK = '_BLANK',
  GLOBAL= '_GLOBAL',
  GROUPSMANAGEMENT = '_GROUPSMANAGEMENT',
  GROUPSMANAGEMENTWrite = '_GROUPSMANAGEMENTWrite',
  BLOGACCESS='_BLOGACCESS',
  MULTIMEDIAAPPROVER = '_MULTIMEDIAAPPROVER',
  MULTIMEDIAUPLOAD = '_MULTIMEDIAUPLOAD',

  BOARDACCESS = '_BOARDACCESS',
  BOARDMANAGER = '_BOARDMANAGER',

  CENTERMANAGER = '_CENTERMANAGER',
  STAFFMANAGER = '_STAFFMANAGER',
  CLIENTMANAGER = '_CLIENTMANAGER',
  EXAMPERMISSIONMANAGER = '_EXAMPERMISSIONMANAGER',

  EDUCOURSEMANAGEMENT = '_CODEMANAGEMENT'
}

export function getPermisionDes (permision: string) {
  return _permision[permision as EPermission]
}

const _permision: {
  [name:string] : IPermissionDes
} = {}

_permision[EPermission.BLANK] = {
  desVN: 'Blank - Quyền mặc định của một nhóm',
  desEN: 'Blank - permission default',
}

_permision[EPermission.GLOBAL] = {
  desVN: 'Quyền tối thượng, bạn có thể làm bất cứ điều gì với một trung tâm mà bạn được cấp quyền này',
  desEN: 'Top Permission, you can do anything with this permission'
}

_permision[EPermission.GROUPSMANAGEMENT] = {
  desVN: 'Quyền Xem các group',
  desEN: 'see the groups'
}

_permision[EPermission.GROUPSMANAGEMENTWrite] = {
  desVN: 'Quyền Sửa xoá các group',
  desEN: 'update/delete the groups'
}

_permision[EPermission.BLOGACCESS] = {
  desVN: 'Quyền Truy cập quản trị thao tác trên blog public page',
  desEN: 'Access Blog in public page'
}

_permision[EPermission.MULTIMEDIAUPLOAD] = {
  desVN: 'Quyền upload clip, hình ảnh',
  desEN: 'upload clip/image permission'
}

_permision[EPermission.MULTIMEDIAAPPROVER] = {
  desVN: 'Quyền duyệt hình ảnh/clip',
  desEN: 'clip/image approving permission'
}


_permision[EPermission.CENTERMANAGER] = {
  desVN: 'Quyền được chỉnh sửa, thiết lập, tạo mới trung tâm',
  desEN: 'Allow to create new, modify or setting a center',
}

_permision[EPermission.STAFFMANAGER] = {
  desVN: 'Quyền được chỉnh sửa, thiết lập, tạo mới nhân viên',
  desEN: 'Allow to create new, modify staffs',
}

_permision[EPermission.CLIENTMANAGER] = {
  desVN: 'Quyền được chỉnh sửa, thiết lập, tạo mới học viên',
  desEN: 'Allow to create new, modify students',
}

_permision[EPermission.EXAMPERMISSIONMANAGER] = {
  desVN: 'Quyền được chỉnh sửa, thiết lập, phân quyền cho giáo viên duyệt đề',
  desEN: 'Permision to grant permission for staff to review the exam',
}

_permision[EPermission.BOARDMANAGER] = {
  desVN: 'Quyền được taọ, chỉnh sửa, thiết lập, phân quyền TaskBoard',
  desEN: 'Permision to create, edit, grant permission for TaskBoard',
}

_permision[EPermission.BOARDACCESS] = {
  desVN: 'Quyền Tham Gia Quy trình, Truy cập vào các Kanban Board',
  desEN: 'Permision to join process, Access to Kanban',
}

_permision[EPermission.EDUCOURSEMANAGEMENT]= {
  desVN: 'Quyền tạo sửa xoá khoá học',
  desEN: 'Permission to create, edit, delete, course',
}