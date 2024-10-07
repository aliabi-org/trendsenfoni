"use client"

import ButtonLink from '@/components/button-link'



const IndexPage = () => {

  return (
    <div className='container mx-auto py-8 px-4 md:px-6 gap-4'>
      <h1>Home</h1>
      <div className='flex flex-auto gap-4'>
        <ButtonLink href="/dairy/addnew" className='shadow-slate-400 text-2xl w-40'>New Dairy</ButtonLink>
        <ButtonLink href="/dairy" className='shadow-slate-400 text-2xl w-40'>List</ButtonLink>
      </div>
      <div className='flex flex-auto gap-4'>
        <ButtonLink href="/dairyPages" className='shadow-slate-400 text-2xl w-40'>Dairy Pages</ButtonLink>
        <ButtonLink href="/items" className='shadow-slate-400 text-2xl w-40'>Items</ButtonLink>
      </div>
    </div>
  )
}

export default IndexPage
