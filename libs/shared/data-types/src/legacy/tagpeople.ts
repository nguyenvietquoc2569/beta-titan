
import { eFacingQueryingInDatabase } from './hanet-face/face-data'
import { EPeopleType, IPeople} from './people'
import { IStaffUser } from './staff-user-type'

export interface ITagPeople {
  fullname?: string,
  dob?: string,
  code?: string,
  type?: Array<EPeopleType>,
  phone?: string,
  people?: IPeople,
  taggedBy?: IStaffUser,
  faceImages: Array<IFaceImage>,
}

export interface IFaceImage {
  hanetServerImageUrl: string,
  deviceID: string
  deviceName: string,
  placeName: string,
  placeID: string,
  time:number,
  faceData?: string,
  vec: Array<number>,
  isQueriedInDatabase: eFacingQueryingInDatabase,
  tags?: ITagPeople,
  otherTags?: Array<ITagPeople>
}
