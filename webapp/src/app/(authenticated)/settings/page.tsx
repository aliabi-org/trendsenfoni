import { FC } from 'react'
import { Metadata } from 'next/types'
import pageMeta from '@/lib/meta-info'

// import { cookies } from 'next/headers'
import ClientOrnek from './ClientOrnek'
export const metadata: Metadata = pageMeta('Settings')


const SettingsPage = () => {
  // const cookieStore = cookies()

  return (
    <div className='container mx-auto py-8 px-4 md:px-6'>
      <h1>Settings</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas ipsum, repudiandae perferendis dolorem voluptate sequi error corrupti odit! Id mollitia repellendus quidem magnam voluptatum eveniet quis molestias qui atque omnis?</p>
      <hr />

      {/* <ClientOrnek token={'prop token'} /> */}

    </div>
  )
}

export default SettingsPage