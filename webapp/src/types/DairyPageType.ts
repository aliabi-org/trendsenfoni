import { DairyType } from './DairyType'
import { EventType } from './EventType'
import { MentalWorkType } from './MentalWorkType'
import { RealPaymentType } from './RealPaymentType'

export interface DairyPageType {
  _id?: string
  dairy?: DairyType
  issueDate?: string
  dayNo?: number
  transferBalance?: number
  debit?: number
  credit?: number
  balance?: number
  dayFinished?: boolean
  events?: EventType[]
  mentalWorks?: MentalWorkType[]
  realPayments?: RealPaymentType[]
}

