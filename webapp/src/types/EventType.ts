import { DairyType } from './DairyType'
import { DairyPageType } from './DairyPageType'

export interface EventType {
  _id?: string
  dairy?: DairyType
  dairyPage?: DairyPageType
  title?: string
  content?: any
  shared?: boolean
}

