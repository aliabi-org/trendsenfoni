"use client"
import React, { useEffect, useState } from 'react'
import { Metadata } from 'next/types'
import pageMeta from '@/lib/meta-info'
import Cookies from 'js-cookie'
import { getItem, postItem } from '@/lib/fetch'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { DairyPageType } from '@/types/DairyPageType'
import { Switch } from '@/components/ui/switch'
import ButtonLink from '@/components/button-link'

const DairyListPage = () => {
  const [token, setToken] = useState('')
  const [list, setList] = useState<DairyPageType[]>([])
  const { toast } = useToast()
  const router = useRouter()
  // const dairyId = Cookies.get('dairyId') || ''

  // const changeDairy = (dairyId: string) => {
  //   postItem(`/session/change/dairy/${dairyId}`, token, {})
  //     .then(result => {
  //       console.log(result)
  //       Cookies.set('dairy', JSON.stringify(result.dairy || null))
  //       Cookies.set('dairyId', result.dairyId || '')
  //       // router.refresh()
  //       location.reload()

  //     })
  //     .catch(err => toast({ title: 'Error', description: err, variant: 'destructive', duration: 1000 }))
  // }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getItem('/dairyPages', token)
        .then(result => {
          console.log('result:', result)
          setList(result.docs as DairyPageType[])
        })
        .catch(err => console.log(err))
    }
  }, [token])
  return (<>

    <Table className='min-w-[900px]'>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[140px]'>Date</TableHead>
          <TableHead className='w-[140px] text-end'>Transfer</TableHead>
          <TableHead className='w-[140px] text-end'>Debit</TableHead>
          <TableHead className='w-[140px] text-end'>Credit</TableHead>
          <TableHead className='w-[140px] text-end'>Balance</TableHead>
          <TableHead className="text-center w-[80px]">Finished</TableHead>
          <TableHead className="text-center w-[60px]">#</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list && list.map((e: DairyPageType) => (
          <TableRow key={e._id} className={`${e.dayFinished ? 'text-[#777]' : ''}`}>
            <TableCell className=''>{e.issueDate} #{e.dayNo}</TableCell>
            <TableCell className='text-end'>{e.transferBalance}</TableCell>
            <TableCell className='text-end'>{e.debit}</TableCell>
            <TableCell className='text-end'>{e.credit}</TableCell>
            <TableCell className='text-end'>{e.balance}</TableCell>
            <TableCell className='text-center'>
              {!e.dayFinished && <i className="fa-solid fa-folder-open"></i>}
              {e.dayFinished && <i className="fa-solid fa-folder-closed"></i>}
            </TableCell>
            <TableCell className="text-center w-[60px] text-xl">
              <ButtonLink href={`/dairyPages/edit/${e._id}`} type='success' >
                <i className="fa-solid fa-edit"></i>
              </ButtonLink>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <div className='mt-8 flex justify-end'>
      <Link href="/dairyPages/addnew" className='bg-primary text-primary-foreground text-2xl py-2 px-3 rounded-md' >
        <i className='fa-solid fa-square-plus ' />
      </Link>
    </div>


  </>
  )
}

export default DairyListPage