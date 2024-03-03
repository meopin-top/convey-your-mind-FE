import {PROJECT_TYPE, ROLLING_PAPER_STATUS} from "@/constants/request"

export type TCreationInformation =
  | "WHOM"
  | "PERSONNEL"
  | "TYPE"
  | "DUE_DATE"
  | "SHARING_CODE"

export type TDoneStep = {
  [step in TCreationInformation]: boolean
}

export type TDueDateType = "DATE" | "D_DAY" | "NONE"

export type TRollingPaperType = {
  template: string
  text: string
}

export type TCanvasElement = "textarea" | "img"

export type TStore = {
  toWhom: string
}

export type TRollingPaperInformation = {
  id: number
  inviteCode: string
  maxInviteNum: number
  destination: string
  type: (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE]
  status: keyof typeof ROLLING_PAPER_STATUS
  expiredDatetime: string
  owner: boolean
}

export type TRollingPaperTextContent = {
  user_id: string
  content_id: string
  content_type: "text"
  x: number
  y: number
  width: number
  height: number
  text: string
}

export type TRollingPaperImageContent = {
  user_id: string
  content_id: string
  content_type: "image"
  x: number
  y: number
  width: number
  height: number
  image_url: string
}

export type TRollingPaperProgressedInformation = {
  project_id: string
  user_id: string
  contents: TRollingPaperContent[]
}

export type TRollingPaperInProgressingInformation = {
  project_id: string
  user_id: string
  content: TRollingPaperContent
}
