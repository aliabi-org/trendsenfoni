// import { UserType } from './UserType'

export interface DairyType {
  _id?: string
  startDate?: string
  endDate?: string
  targetIncome?: number
  hourlyWage?: number
  currency?: string | '' | 'EUR' | 'TRY' | 'RUB' | 'GBP' | 'USD'
  personalGoals?: PersonalGoalType[]
  passive?: boolean
}

export interface PersonalGoalType {
  _id?: string
  name?: string
  done?: boolean
  percent?: number

}