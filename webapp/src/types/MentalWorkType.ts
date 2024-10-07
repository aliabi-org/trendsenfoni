import { DairyType } from './DairyType'
import { DairyPageType } from './DairyPageType'
import { ItemType } from './ItemType'

export interface MentalWorkType {
  _id?: string
  dairy?: DairyType
  dairyPage?: DairyPageType
  item?: ItemType
  quantity?: number
  price?: number
  total?: number
}

