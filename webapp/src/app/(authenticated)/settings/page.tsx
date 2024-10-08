"use client"

import { ConnectorSettings } from './connector-settings'
import { SqlConnection } from './sql-connection'

export default function SettingsPage() {
  // const cookieStore = cookies()

  return (
    <div className='container mx-auto py-2 px-4 md:px-6 flex flex-col gap-4'>
      <h1>Ayarlar</h1>
      <hr />
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <ConnectorSettings />
        <SqlConnection />
      </div>

    </div>
  )
}

