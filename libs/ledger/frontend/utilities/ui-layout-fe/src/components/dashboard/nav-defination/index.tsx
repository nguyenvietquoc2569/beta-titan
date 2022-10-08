import { SvgIconStyle } from '@beta-titan/ledger/frontend/utilities/core-components';
import { EPermission } from '@beta-titan/shared/data-types'
import { NavListProps } from '../../../components/nav-section';
import { ELanguage, useLangContext } from '../../multi-language/language-context'
const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};


interface INavMainItem {
  title: string,
  path: string,
  icon: JSX.Element,
  children?: Array<{
    title: 'profile',
    path: string,
    permissions: Array<EPermission>
  }>,
  permissions: Array<EPermission>
}

interface INavMainMenu {
  subheader: string,
  items: Array<INavMainItem>,
  permissions: Array<EPermission>
}
export const useNavDefination = (): Array<INavMainMenu> => {
  const { t } = useLangContext()
  return [
    {
      subheader: t({[ELanguage.VI]: 'Kanban', [ELanguage.EN]: 'Kanban'}),
      permissions: [],
      items: [
        // {
        //   icon: ICONS.kanban,
        //   title: t({[ELanguage.VI]: 'Thu nhận học viên', [ELanguage.EN]: 'Customer Acquired'}),
        //   path: '/home/ec/customer-acquire/table-view',
        //   permissions: [EPermission.BOARDACCESS]
        // },
        {
          icon: ICONS.kanban,
          title: t({[ELanguage.VI]: 'Quản trị board', [ELanguage.EN]: 'Board Manager'}),
          path: '/home/kanban/manager',
          permissions: [EPermission.BOARDACCESS]
        },
      ]
    },
    {
      subheader: t({[ELanguage.VI]: 'Tư Vấn', [ELanguage.EN]: 'Education Consutants'}),
      permissions: [],
      items: [
        {
          icon: ICONS.cart,
          title: t({[ELanguage.VI]: 'Thu nhận học viên', [ELanguage.EN]: 'Customer Acquired'}),
          path: '/home/ec/customer-acquire/table-view',
          permissions: []
        }
      ]
    },
    {
      subheader: t({[ELanguage.VI]: 'Quản Lý Đào Tạo', [ELanguage.EN]: 'Education Management'}),
      permissions: [],
      items: [
        {
          icon: ICONS.kanban,
          title: t({[ELanguage.VI]: 'Quản lí khoá học', [ELanguage.EN]: 'Course Management'}),
          path: '/home/edu/courses',
          permissions: []
        }
      ]
    },
    
  ]
}

type INavUser = Array<{
  subheader: string;
  items: NavListProps[];
}>
export const useNavForUser = (): INavUser => {
  const navDef = useNavDefination()
  const result: INavUser = []

  // Chuyển các quyền ở dưới lên trên
  for (const _mainMenu of navDef) {
    let mPermissions = new Set([..._mainMenu.permissions, EPermission.GLOBAL])
    for (const item of _mainMenu.items) {
      const permissions = new Set([...item.permissions, EPermission.GLOBAL])
      if (item.children) {
        for (const child of item.children) {
          if (child.permissions) {
            child.permissions = Array.from(new Set([...child.permissions, EPermission.GLOBAL]))
            child.permissions.forEach((value) => {permissions.add(value)})
          }
        }
      }
      item.permissions = Array.from(permissions)
      mPermissions = new Set([...permissions, ...mPermissions])
    }
    _mainMenu.permissions = Array.from(mPermissions)
  }

  for (const _mainMenu of navDef) {
    const items: Array<NavListProps> = []

    for (const item of _mainMenu.items) {
      const children: Array<{
        title: string,
        path: string}> = []
      
      if (item.children) {
        for (const child of item.children) {
          children.push({
            title: child.title,
            path: child.path
          })
        }
      }
      items.push({
        title: item.title,
        path: item.path,
        children: children.length ? children : undefined,
        icon: item.icon
      })
    }

    result.push({
      subheader: _mainMenu.subheader,
      items: items
    })
  }

  return result
}