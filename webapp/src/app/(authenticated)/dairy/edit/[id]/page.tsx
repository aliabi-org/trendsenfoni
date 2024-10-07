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
import { DairyType } from '@/types/DairyType'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'
import { ButtonConfirm } from '@/components/button-confirm'


interface Props {
  params: {
    id: string
  }
}
const DairyPage: FC<Props> = ({ params }) => {
  console.log('params:', params)
  const router = useRouter()
  const [token, setToken] = useState('')
  const [dairy, setDairy] = useState<DairyType | null>(null)
  const [newGoal, setNewGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const save = () => {
    putItem(`/dairy/${params.id}`, token, dairy)
      .then(result => {
        router.push('/dairy')
      })
      .catch(err => console.log(err))
  }

  const deleteDairy = () => {
    deleteItem(`/dairy/${params.id}`, token)
      .then(result => {
        router.push('/dairy')
      })
      .catch(err => console.log(err))
  }

  const addNewGoal = () => {
    if (newGoal && dairy) {
      setLoading(true)
      if (!dairy.personalGoals) dairy.personalGoals = []
      dairy.personalGoals.push({ name: newGoal })
      setDairy({ ...dairy, personalGoals: dairy.personalGoals })
      setNewGoal('')
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getItem(`/dairy/${params.id}`, token)
        .then(result => {
          setDairy(result as DairyType)
        })
        .catch(err => console.log(err))
    }
  }, [token])
  return (<>
    {dairy &&
      <div className='space-y-4'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Start/End</Label>
            <p>{dairy?.startDate} - {dairy?.endDate}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <div className='flex w-full space-x-4 pe-4  items-end'>
                <div className='flex-auto' >
                  <Label>Target Income (for 1 year)</Label>
                  <Input
                    type='number'
                    defaultValue={dairy.targetIncome}
                    onChange={e => {
                      let targetIncome = Number(e.target.value || 0)
                      if (isNaN(targetIncome)) targetIncome = 0
                      let hourlyWage = Math.floor(targetIncome / 1000)
                      setDairy({ ...dairy, targetIncome: targetIncome, hourlyWage: hourlyWage })
                    }}
                    onFocus={e => e.target.select()}
                  />
                </div>
                <div className='flex-shrink mb-1'>
                  {/* <Label>&nbsp;</Label> */}
                  <select
                    className='p-1 py-2 bg-slate-400 text-blue-900 rounded-sm text-sm'
                    defaultValue={dairy.currency}
                    onChange={e => setDairy({ ...dairy, currency: e.target.value })}
                  >
                    <option value="EUR">EUR</option>
                    <option value="TRY">TRY</option>
                    <option value="RUB">RUB</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                  </select>

                </div>
              </div>

            </div>

            <div className="flex items-center justify-start gap-4">
              <Label>Hourly Wage:</Label>
              <div>{dairy.hourlyWage} {dairy.currency}</div>
            </div>
            {/* <div className="flex items-center justify-start gap-4">
              <Switch defaultChecked={!dairy.passive} onCheckedChange={e => setDairy({ ...dairy, passive: !e })} />
              <Label>Active</Label>
            </div> */}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Personal Goals (for 1 year)</Label>
            {dairy.personalGoals && dairy.personalGoals.map((e, index) => (
              <div className='flex justify-between items-center'>
                <div className='flex-auto'>{e.name}</div>
                <div className='flex-shrink'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      dairy.personalGoals?.splice(index, 1)
                      setDairy({ ...dairy, personalGoals: dairy.personalGoals })
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
                  defaultValue={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  autoFocus={true}
                  onKeyDown={e => {
                    if (e.key == 'Enter') addNewGoal()
                    // console.log(e.code)
                  }}
                />
                <Button
                  className='flex-shrink'
                  variant={'outline'}
                  onClick={addNewGoal}


                >
                  <i className='fa-solid fa-square-plus text-xl'></i>
                </Button>

              </div>
            }
          </div>

          <div className='w-full flex flex-row justify-between '>
            <div>
              <ButtonConfirm
                text='Do you want to delete this dairy?'
                onOk={() => deleteDairy()}>
                <Button variant={'destructive'} ><i className="fa-solid fa-trash-alt text-xl"></i></Button>
              </ButtonConfirm>

            </div>
            <div className='w-full flex flex-row justify-end gap-4'>
              <Button variant={'secondary'} onClick={() => router.back()}><i className="fa-solid fa-angle-left text-2xl"></i></Button>
              <Button onClick={save} ><i className="fa-solid fa-check text-2xl"></i></Button>
            </div>
          </div>
        </div>
      </div>

    }
  </>
  )
}

export default DairyPage