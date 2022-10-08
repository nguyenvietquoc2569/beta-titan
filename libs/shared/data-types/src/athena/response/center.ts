import { ICenter } from "../center";
import { EPermission } from "../permission";

export interface ICenterCodeTree {
  code: string,
  mongoObject?: ICenter,
  children: Array<ICenterCodeTree>,
  permission?: Array<EPermission>
}
