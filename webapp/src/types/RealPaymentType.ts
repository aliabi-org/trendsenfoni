import { DairyType } from './DairyType'
import { DairyPageType } from './DairyPageType'

export interface RealPaymentType {
  _id?: string
  dairy?: DairyType
  dairyPage?: DairyPageType
  description?: string
  total?: number
}

