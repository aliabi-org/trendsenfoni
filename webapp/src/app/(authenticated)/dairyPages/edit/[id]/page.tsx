"use client"
import React, { FC, useEffect, useState } from 'react'
import { Metadata } from 'next/types'
import pageMeta from '@/lib/meta-info'
import Cookies from 'js-cookie'
import { getItem, postItem, putItem, deleteItem } from '@/lib/fetch'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DairyPageType } from '@/types/DairyPageType'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'
import { ButtonConfirm } from '@/components/button-confirm'
import { MentalWorkType } from '@/types/MentalWorkType'
import { RealPaymentType } from '@/types/RealPaymentType'
import { EventType } from '@/types/EventType'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import { DairyType } from '@/types/DairyType'

interface Props {
  params: {
    id: string
  }
}
const EditPage: FC<Props> = ({ params }) => {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [dairy, setDairy] = useState<DairyType>()
  const [dairyPage, setDairyPage] = useState<DairyPageType>()
  const [newEvent, setNewEvent] = useState<EventType>({ title: '' })
  const [newMentalWork, setNewMentalWork] = useState<MentalWorkType>({ quantity: 1, item: undefined, price: 0, total: 0 })
  const [newRealPayment, setNewRealPayment] = useState<RealPaymentType>({ description: '', total: 0 })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const save = () => {
    putItem(`/dairyPages/${params.id}`, token, dairyPage)
      .then(result => {
        // router.push('/dairyPages')
        console.log('save result:', result)
      })
      .catch(err => toast({ description: err || 'error', title: 'Error' }))
  }

  // const deleteDairy = () => {
  //   deleteItem(`/dairy/${params.id}`, token)
  //     .then(result => {
  //       router.push('/dairy')
  //     })
  //     .catch(err => console.log(err))
  // }

  const addNewEvent = () => {
    if (newEvent && newEvent.title && dairyPage) {
      setLoading(true)
      if (!dairyPage.events) dairyPage.events = []

      postItem(`/events`, token, {
        dairyPage: dairyPage._id,
        title: newEvent.title
      })
        .then(result => {
          dairyPage.events?.push(result as EventType)
          setDairyPage({ ...dairyPage, events: dairyPage.events })

          setNewEvent({ title: '' })
          setTimeout(() => setLoading(false), 100)
        })
        .catch(err => {
          toast({ description: err || 'error', title: 'Error' })
          setTimeout(() => setLoading(false), 100)
        })

    }
  }

  const addNewRealPayment = () => {
    if (newRealPayment && newRealPayment.description && newRealPayment.total! > 0 && dairyPage) {
      setLoading(true)
      if (!dairyPage.realPayments) dairyPage.realPayments = []
      postItem(`/realPayments`, token, {
        dairyPage: dairyPage._id,
        description: newRealPayment.description,
        total: newRealPayment.total,
      })
        .then(result => {
          dairyPage.realPayments?.push(result as RealPaymentType)
          setDairyPage({ ...dairyPage, realPayments: dairyPage.realPayments })

          setNewRealPayment({ description: '', total: 0 })
          setTimeout(() => setLoading(false), 100)
        })
        .catch(err => {
          toast({ description: err || 'error', title: 'Error' })
          setTimeout(() => setLoading(false), 100)
        })

    }
  }
  const addNewMentalWork = () => {
    if (newMentalWork && dairyPage) {
      setLoading(true)
      if (!dairyPage.mentalWorks) dairyPage.mentalWorks = []
      dairyPage.mentalWorks.push(newMentalWork)
      setDairyPage({ ...dairyPage, mentalWorks: dairyPage.mentalWorks })
      setNewMentalWork({ quantity: 1, item: undefined, price: 0, total: 0 })
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  const EventsTab = () => {
    if (!dairyPage) return (<></>)
    return (<div className="flex flex-col gap-2">
      {dairyPage.events && dairyPage.events.map((e, index) => (
        <div className='flex justify-between items-center'>
          <div className='flex-auto'>{e.title}</div>
          <div className='flex-shrink'>
            <Button
              variant={'destructive'}
              onClick={() => {
                deleteItem(`/events/${e._id}`, token)
                  .then(result => {
                    dairyPage.events?.splice(index, 1)
                    setDairyPage({ ...dairyPage, events: dairyPage.events })
                  })
                  .catch(err => toast({ description: err || 'error', title: 'Error' }))
              }}
            >
              <i className='fa-solid fa-trash-alt'></i>
            </Button>
          </div>
        </div>
      ))}
      {!loading &&
        <div className='flex justify-between items-center gap-4'>
          <Input
            className='flex-auto'
            type='text'
            defaultValue={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            autoFocus={true}
            onKeyDown={e => {
              if (e.key == 'Enter') addNewEvent()
            }}
          />
          <Button className='flex-shrink' variant={'outline'} onClick={addNewEvent}>
            <i className='fa-solid fa-square-plus text-xl'></i>
          </Button>

        </div>
      }
    </div>)
  }

  const MentalWorksTab = () => {
    if (!dairyPage) return (<></>)
    return (<div className="flex flex-col gap-2">
      <Label>Financial Actions</Label>
    </div>)
  }

  const RealPaymentsTab = () => {
    if (!dairyPage) return (<></>)
    return (<div className="flex flex-col gap-2">
      {dairyPage.realPayments && dairyPage.realPayments.map((e, index) => (
        <div className='flex justify-between items-center'>
          <div className='flex-auto'>{e.description}</div>
          <div className='flex-shrink me-4'>{e.total} <span className='text-xs'>EUR</span></div>
          <div className='flex-shrink'>
            <Button
              // className='px-3 py-1 text-sm'
              variant={'destructive'}
              onClick={() => {
                deleteItem(`/realPayments/${e._id}`, token)
                  .then(result => {
                    dairyPage.realPayments?.splice(index, 1)
                    setDairyPage({ ...dairyPage, realPayments: dairyPage.realPayments })
                  })
                  .catch(err => toast({ description: err || 'error', title: 'Error' }))
              }}
            >
              <i className='fa-solid fa-trash-alt'></i>
            </Button>
          </div>
        </div>
      ))}
      {!loading &&
        <div className='flex justify-between items-center gap-4'>
          <Input
            className='flex-auto'
            type='text'
            defaultValue={newRealPayment.description}
            onChange={e => setNewRealPayment({ ...newRealPayment, description: e.target.value })}

          />
          <Input
            className='flex-auto'
            type='number'
            defaultValue={newRealPayment.total}
            onChange={e => {
              const total = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
              setNewRealPayment({ ...newRealPayment, total: total })
            }}
            onFocus={e => e.target.select()}
            onKeyDown={e => {
              if (e.key == 'Enter') addNewRealPayment()
            }}
          />
          <Button className='flex-shrink' variant={'outline'} onClick={addNewRealPayment}>
            <i className='fa-solid fa-square-plus text-xl'></i>
          </Button>

        </div>
      }
    </div>)
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getItem(`/dairyPages/${params.id}`, token)
        .then(result => {

          setDairyPage(result as DairyPageType)
        })
        .catch(err => console.log(err))
    }
  }, [token])
  return (<>
    {dairyPage &&
      <div className='flex flex-col gap-2'>
        {/* <div className='grid grid-cols-5 gap-2 text-sm'>
            <div className='flex flex-col'>
              <div>{dairyPage.issueDate}</div>
              <div>{dairyPage.dayNo}</div>
            </div>
            <div className='flex flex-col'>
              <div>Transfer</div>
              <div>{dairyPage.transferBalance}</div>
            </div>
            <div>Debit: {dairyPage.debit}</div>
            <div>Credit: {dairyPage.credit}</div>
            <div>Balance: {dairyPage.balance}</div>
          </div> */}
        <div className='flex gap-4 justify-center'>
          <div>{dairyPage.issueDate}</div>
          <div>Day #{dairyPage.dayNo}</div>
        </div>
        <Table className='text-sm'>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Transfer</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-right">{dairyPage.transferBalance}</TableCell>
              <TableCell className="text-right">{dairyPage.debit}</TableCell>
              <TableCell className="text-right">{dairyPage.credit}</TableCell>
              <TableCell className="text-right">{dairyPage.balance}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Tabs defaultValue="mentalworks" className="">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mentalworks">Mental Works</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="realpayments">Real Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="mentalworks">
            <MentalWorksTab />
            <div className='w-full flex flex-row justify-between mt-4 '>

              <div className='w-full flex flex-row justify-end gap-4'>
                <Button variant={'secondary'} onClick={() => router.back()}><i className="fa-solid fa-angle-left text-2xl"></i></Button>
                <Button onClick={save} ><i className="fa-solid fa-check text-2xl"></i></Button>
              </div>
            </div>
          </TabsContent>
          {/* <TabsContent value="events"><EventsTab /></TabsContent> */}
          <TabsContent value="events">{EventsTab()}</TabsContent>
          {/* <TabsContent value="realpayments"><RealPaymentsTab /></TabsContent> */}
          <TabsContent value="realpayments">{RealPaymentsTab()}</TabsContent>
        </Tabs>


      </div>

    }
  </>
  )
}

export default EditPage