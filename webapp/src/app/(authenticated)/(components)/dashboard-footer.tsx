"use client"
import { DairyType } from '@/types/DairyType'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
export const DashboardFooter = (props: any) => {
  const [dairy, setDairy] = useState<DairyType>()
  const token = Cookies.get('token') || ''

  useEffect(() => {
    try {
      let s = Cookies.get('dairy')
      if (s) {
        setDairy(JSON.parse(s) as DairyType)
      }
    } catch (error) {
      console.log(error)
    }
  }, [token])
  return (
    <footer
      className="flex items-center justify-between border-t bg-white px-2 py-4 dark:border-gray-800 dark:bg-gray-950 p-1"
      {...props}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {/* © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_COMPANY_NAME || 'ENV ERROR'}. */}
        ©{new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_COMPANY_NAME || 'ENV ERROR'}
      </p>
      <div className='flex items-center gap-2'>
        {dairy && <>
          <div className='flex flex-col gap-0'>
            <div className='text-xs text-gray-500'>{dairy.startDate}</div>
            <div className='text-xs text-gray-500'>{dairy.endDate}</div>
          </div>


          <span>{dairy.hourlyWage} {dairy.currency}</span>
        </>}
      </div>
    </footer>
  )
}

export default DashboardFooter