import { IPeople } from "./people";
import { IStaffUser } from "./staff-user-type";

export interface IClientFeedback {
  receivedBy: IStaffUser,
  time: number,
  tags: Array<string>,
  content: string,
  client: IPeople,
  unlinkClient: IPeople,
  mood: number
}