export interface IMedia {
  bucketName: string
  contentType: string
  filename: string
  id: string
  mimetype: string
  originalname: string,
  [key:string] : any
}

export let MediaDefault = {
  bucketName: "fs",
  chunkSize: 261120,
  contentType: "image/jpeg",
  encoding: "7bit",
  fieldname: "file",
  filename: "Beta-7d004347-91ea-4f3b-b3a2-45175975d075-.jpeg",
  id: "5fedf30a71666b5097df07e0",
  md5: "54dd9e4509130423b96c0090fb4c3eb2",
  metadata: null,
  mimetype: "image/jpeg",
  originalname: "images.jpeg",
  size: 8594,
  uploadDate: "2020-12-31T15:49:30.862Z",
}