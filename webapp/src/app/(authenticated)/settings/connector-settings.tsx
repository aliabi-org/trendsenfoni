"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { getItem, putItem } from '@/lib/fetch'
import { SettingType } from '@/types/SettingType'

export function ConnectorSettings() {
  const [token, setToken] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientPass, setClientPass] = useState('')
  const [testResult, setTestResult] = useState({})

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const save = () => {
    putItem(`/settings`, token, {
      connector: {
        clientId: clientId,
        clientPass: clientPass,
      }
    })
      .then((result: SettingType) => {
        console.log('result:', result)
        toast({ title: 'Kayıt Başarılı' })
      })
      .catch(err => toast({ title: 'error', description: err || '' }))
  }

  const load = () => {
    getItem('/settings', token)
      .then((result: SettingType) => {
        setClientId(result.connector?.clientId || '')
        setClientPass(result.connector?.clientPass || '')
      })
      .catch(err => toast({ title: 'error', description: err || '' }))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Connector</CardTitle>
        <CardDescription>Anamakinaya kurulmus olan Connector baglanti bilgileri</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label >Client ID</Label>
            <Input
              defaultValue={clientId}
              onBlur={e => setClientId(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Client Pass</Label>
            <Input
              defaultValue={clientPass}
              onBlur={e => setClientPass(e.target.value)}
            />
          </div>
          {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
        </div>

      </CardContent>
      <CardFooter className="flex flex-col">
        <div className='flex justify-between w-full'>
          <Button variant="outline"><i className="fa-solid fa-xmark"></i></Button>
          <Button onClick={save}><i className="fa-solid fa-check"></i></Button>
        </div>
        <div>
          <pre>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      </CardFooter>
    </Card>
  )
}
