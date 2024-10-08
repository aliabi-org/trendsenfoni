"use client"

import { PieCart1 } from './pie-chart'

export default function Home() {
  return (
    <div className='container'>
      <div className='grid grid-cols-2 md:grid-cols-6'>
        <PieCart1 />
        <PieCart1 />
        <PieCart1 />
        <PieCart1 />
      </div>

    </div>
  )
}
