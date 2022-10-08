export interface ICenter {
  _id?: string,
  code: string;
  name: string;
  eName: string;
  address?: string;
  phone?: string;
  parent?: ICenter,
  deactive?: boolean
}