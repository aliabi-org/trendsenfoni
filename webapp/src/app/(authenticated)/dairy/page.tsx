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
import { DairyType } from '@/types/DairyType'
import { Switch } from '@/components/ui/switch'
import ButtonLink from '@/components/button-link'

const DairyListPage = () => {
  const [token, setToken] = useState('')
  const [list, setList] = useState<DairyType[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const dairyId = Cookies.get('dairyId') || ''

  const changeDairy = (dairyId: string) => {
    postItem(`/session/change/dairy/${dairyId}`, token, {})
      .then(result => {
        console.log(result)
        Cookies.set('dairy', JSON.stringify(result.dairy || null))
        Cookies.set('dairyId', result.dairyId || '')
        // router.refresh()
        location.reload()

      })
      .catch(err => toast({ title: 'Error', description: err, variant: 'destructive', duration: 1000 }))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getItem('/dairy', token)
        .then(result => {
          console.log('result:', result)
          setList(result.docs as DairyType[])
        })
        .catch(err => console.log(err))
    }
  }, [token])
  return (<>

    <Table className='min-w-[640px]'>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[140px]'>Start/End</TableHead>
          <TableHead className='w-[140px] text-end'>Target Income</TableHead>
          <TableHead className='w-[140px] text-end'>Hourly Wage</TableHead>
          <TableHead className='text-center'>Active</TableHead>
          {/* <TableHead className="text-center w-[60px]">#</TableHead> */}
          <TableHead className="text-center w-[60px]">#</TableHead>
          {/* <TableHead className="text-center w-[60px]">#</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {list && list.map((e: DairyType) => (
          <TableRow key={e._id} className={`${e._id == dairyId ? 'text-[#777]' : ''}`}>
            <TableCell className='flex items-center gap-2'>
              <i className="fa-solid fa-book"></i>
              <div className='flex flex-col text-sm'>
                <div>{e.startDate}</div>
                <div>{e.endDate}</div>
              </div>
            </TableCell>
            <TableCell className='text-end'>{e.targetIncome}</TableCell>
            <TableCell className='text-end'>{e.hourlyWage}</TableCell>
            {/* <TableCell className='text-center'>
              <Switch checked={!e.passive} />
            </TableCell> */}
            <TableCell className="text-center w-[60px] text-xl">
              <ButtonLink href={`/dairy/edit/${e._id}`} type='success' >
                <i className="fa-solid fa-edit"></i>
              </ButtonLink>
            </TableCell>
            <TableCell className="text-center w-[60px] text-xl">
              {dairyId == e._id && <><i className="fa-solid fa-check-double"></i></>}
              {dairyId != e._id && !e.passive && <>
                <Button onClick={() => changeDairy(e._id || '')}>
                  <i className="fa-solid fa-check"></i>
                </Button>
              </>}
            </TableCell>
            {/* <TableCell className="text-center w-[60px] text-xl">
                {e._id == dbId && <div>
                  <i className="fa-solid fa-check-double"></i>
                </div>}
                {e._id != dbId && <>
                  <Button variant={'outline'} onClick={() => changeDb(e._id || '')}>
                    <i className="fa-solid fa-check"></i>
                  </Button>
                </>}
              </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <div className='mt-8 flex justify-end'>
      <Link href="/dairy/addnew" className='bg-primary text-primary-foreground text-2xl py-2 px-3 rounded-md' >
        <i className='fa-solid fa-square-plus ' />
      </Link>
    </div>


  </>
  )
}

export default DairyListPage