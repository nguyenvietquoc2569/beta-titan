import { ELoginRole, EPermission } from "@beta-titan/shared/data-types";

interface IPageAuthConfig {
  requiredLoginSession: boolean,
  permissions: ((permissionList: Array<EPermission>) => boolean) | null | undefined,
  role?: Array<ELoginRole> | null| undefined,
  pattern?: any
}

interface IAuthUrlConfig {
  [key: string]: IPageAuthConfig,
}

export const AuthUrlConfig: IAuthUrlConfig = {
  // '/home/settings/groups-management': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.GROUPSMANAGEMENT) || p.includes(EPermission.GROUPSMANAGEMENTWrite)
  //   },
  //   role: [ELoginRole.STAFF]
  // },

  // '/portal/settings/centers': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.CENTERMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/settings/account-management/client': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.CLIENTMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/settings/account-management/staff': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.STAFFMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/settings/exam-management': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.EXAMPERMISSIONMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/examhub/my-problem-management': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/examhub/org-problem-management': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/examhub/my-exam-management': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/examhub/org-exam-management': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/portal/examhub/monitor/[id]': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.STAFF],
  //   pattern: /^\/portal\/examhub\/monitor\/([a-zA-Z0-9]+)$/
  // },
  // '/portal/exam': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.CLIENT]
  // },
  // '/portal/exam/runner': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.CLIENT]
  // },
  // '/portal/exam/[id].tsx': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.CLIENT],
  //   pattern: /^\/portal\/exam\/([a-zA-Z0-9]+)$/
  // },


  // '/api/v1/files/upload': {
  //   requiredLoginSession: true,
  //   permissions: null,
  //   role: null
  // },
  // '/api/v1/centers/updatelogoforcenter': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.CENTERMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/api/user/change-self-pass': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return true
  //   },
  //   role: [ELoginRole.STAFF, ELoginRole.CLIENT]
  // },
  // '/api/v1/users/create-new-client-user': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.CLIENTMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // },
  // '/api/v1/users/reset-password': {
  //   requiredLoginSession: true,
  //   permissions: (p: Array<EPermission>) => {
  //     return p.includes(EPermission.GLOBAL) || p.includes(EPermission.CLIENTMANAGER) || p.includes(EPermission.STAFFMANAGER)
  //   },
  //   role: [ELoginRole.STAFF]
  // }

}

export const addRuleToIAuthUrlConfig = (url: string, config: IPageAuthConfig) => {
  AuthUrlConfig[url] = config
}