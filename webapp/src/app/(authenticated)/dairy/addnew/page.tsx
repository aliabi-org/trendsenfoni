"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { DairyType, PersonalGoalType } from '@/types/DairyType'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Select } from '@/components/ui/select'
import { ButtonInfo } from '@/components/button-information'
import { useToast } from '@/components/ui/use-toast'
import { postItem } from '@/lib/fetch'
import Cookies from 'js-cookie'
import Loading from '@/components/loading'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [dairy, setDairy] = useState<DairyType>({
    targetIncome: 0,
    hourlyWage: 0,
    currency: 'TRY',
    personalGoals: [],

  })
  const [newGoal, setNewGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const token = Cookies.get('token') || ''

  const nextStep = () => {
    if (step == 1 && (dairy.targetIncome || 0) <= 0) {
      return toast({ description: `target income must be greater than zero`, duration: 1000 })
    }
    if (step == 3) {
      saveDairy()
    }
    setStep((prev) => Math.min(prev + 1, 3))
  }
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const saveDairy = () => {
    setLoading(true)
    postItem(`/dairy`, token, dairy)
      .then(result => {
        setLoading(false)
        console.log(result)
        //toast({ description: `Saved`, duration: 1000 })
        // toast({ description: JSON.stringify(result, null, 2), duration: 1000 })
        router.push('/home')
      })
      .catch(err => {
        setLoading(false)
        toast({ description: err.message || err, duration: 2000 })
      })

  }

  const addNewGoal = () => {
    if (newGoal) {
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

  const Step1 = () => (<div className="space-y-4">
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

    <div className="space-y-2">
      <Label>Hourly Wage</Label>
      <p>{dairy.hourlyWage} {dairy.currency}</p>
    </div>
  </div>)

  const Step2 = () => (<div className="space-y-4">
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
  </div>)

  const Step3 = () => (<>

    <div className="space-y-4">
      <div className="space-y-2">
        <Label className='text-xl'>Summary</Label>
        <div className='flex flex-col space-y-2 text-sm'>
          <div className='flex justify-start items-center gap-4'>
            <div >Start:</div>
            <div className='font-bold text-lg'>{new Date().toLocaleDateString()}</div>
          </div>
          <div className='flex justify-start items-center gap-4'>
            <div>End:</div>
            <div className='font-bold text-lg'>{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}</div>
          </div>
          <div className='flex justify-start items-center gap-4'>
            <div>Target Income:</div>
            <div className='font-bold text-lg'>{dairy.targetIncome} {dairy.currency}</div>
          </div>
          <div className='flex justify-start items-center gap-4'>
            <div>Hourly Wage:</div>
            <div className='font-bold text-lg'>{dairy.hourlyWage} {dairy.currency}</div>
          </div>
          <div className='flex flex-col justify-start items-start gap-2'>
            <div className='border-b w-full pb-1'>Personal Goals:</div>
            <div className='font-bold text-lg ms-8'>
              <ul className='list-disc'>
                {dairy.personalGoals && dairy.personalGoals.map((e, index) => (
                  <li>{e.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>


  </>
  )

  return (
    <div className="flex items-center justify-center p11-1">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className='text-lg md:text-2xl flex justify-between'><div>New Dairy</div><div># {step}/3</div></CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && Step1()}
          {/* {step === 2 && <Step2 />} */}
          {/* {step === 2 && <>{Step2()}</>} */}
          {step === 2 && Step2()}
          {step === 3 && <Step3 />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            <i className="fa-solid fa-angle-left"></i>
          </Button>
          <ButtonInfo>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti suscipit eveniet reiciendis, consequuntur delectus maxime vel, magnam quis ab explicabo molestiae, nisi tempore exercitationem! Rerum obcaecati natus consectetur molestias quia?</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam accusantium natus delectus dolorem ipsam hic esse eaque explicabo illum. Aperiam vel incidunt eligendi explicabo modi eum nostrum ea illum enim.</p>
          </ButtonInfo>
          <Button
            onClick={nextStep}
            disabled={loading}
          >
            {!loading && <>
              {step == 3 && <i className="fa-solid fa-cloud-arrow-up"></i>}
              {step != 3 && <i className="fa-solid fa-chevron-right"></i>}
            </>}
            {loading && <Loading />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

