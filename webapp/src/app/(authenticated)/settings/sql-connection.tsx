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
import { getItem, postItem, putItem } from '@/lib/fetch'
import { ConnectorType, MsSqlConnectionType, SettingType } from '@/types/SettingType'
import { Switch } from '@/components/ui/switch'

export function SqlConnection() {
  const [token, setToken] = useState('')
  const [connector, setConnector] = useState<ConnectorType>({})
  const [testResult, setTestResult] = useState('')

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()


  const load = () => {

    getItem('/settings', token)
      .then((result: SettingType) => {
        setConnector(result.connector || { mssql: {} })
      })
      .catch(err => toast({ title: 'error', description: err || '' }))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  return (<>
    {connector.mssql &&
      <Card className="w11-[340px]">
        <CardHeader className="p-3">
          <CardTitle>MsSql Connection</CardTitle>
          {/* <CardDescription>Anamakinaya kurulmus olan Connector baglanti bilgileri</CardDescription> */}
        </CardHeader>
        <CardContent className='p-3 flex flex-col gap-4'>
          {/* <div className='text-sm bg-slate-200 dark:bg-slate-800 p-2 rounded-md'>
          <div className='w-full bg-green-500 p-1 rounded-sm'>Connector</div>
          <div><span className='text-gray-500'>cliendId:</span> {clientId}</div>
          <div><span className='text-gray-500'>cliendPass:</span> {clientPass}</div>
        </div> */}

          <div className="grid w-full items-center gap-4">
            <div className='grid grid-cols-2 gap-4'>
              <div className="flex flex-col space-y-1.5">
                <Label >MS SQL Server</Label>
                <Input
                  defaultValue={connector.mssql?.server || 'localhost'}
                  onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, server: e.target.value } })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Instance</Label>
                <Input
                  defaultValue={connector.mssql?.dialectOptions?.instanceName || 'SQLExpress'}
                  onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, dialectOptions: { instanceName: e.target.value } } })}
                />
              </div>

            </div>
            <div className="flex flex-col space-y-1.5">
              <Label >Port</Label>
              <Input
                type='number'
                defaultValue={connector.mssql?.port || 1433}
                onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, port: isNaN(Number(e.target.value)) ? 1433 : Number(e.target.value) } })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Database</Label>
              <Input
                defaultValue={connector.mssql?.database || 'Mikro_V16'}
                onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, database: e.target.value } })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Db User</Label>
              <Input
                defaultValue={connector.mssql?.user || 'sa'}
                onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, user: e.target.value } })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Db Password</Label>
              <Input
                type='password'
                defaultValue={connector.mssql?.password || ''}
                onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, password: e.target.value } })}
              />
            </div>
            <div className="">
              <Label className='flex items-center gap-2'>
                <Switch
                  defaultChecked={connector.mssql?.options?.encrypt || false}
                  onCheckedChange={e => setConnector({ ...connector, mssql: { ...connector.mssql, options: { ...connector.mssql?.options, encrypt: e } } })}
                />
                Encrypt
              </Label>
            </div>
            <div className="">
              <Label className='flex items-center gap-2'>
                <Switch
                  defaultChecked={connector.mssql?.options?.trustServerCertificate || false}
                  onCheckedChange={e => setConnector({ ...connector, mssql: { ...connector.mssql, options: { ...connector.mssql?.options, trustServerCertificate: e } } })}

                />
                Trust Server Certificate
              </Label>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label >Ana Uygulama</Label>
              {connector.mssql &&
                <Select
                  defaultValue={connector.mssql?.mainApp || 'general'}
                  onValueChange={e => setConnector({ ...connector, mssql: { ...connector.mssql, mainApp: e } })}
                >
                  <SelectTrigger >
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="mikro_v16">Mikro V16</SelectItem>
                    <SelectItem value="eta_v8">Eta V8 SQL</SelectItem>
                    <SelectItem value="logo_go">Logo Go</SelectItem>
                    <SelectItem value="logo_tiger">Logo Tiger</SelectItem>
                    <SelectItem value="netsis_v3">Netsis V3</SelectItem>
                    <SelectItem value="zirve">Zirve</SelectItem>
                    <SelectItem value="general">Genel</SelectItem>
                  </SelectContent>
                </Select>
              }
              {!connector.mssql && <div>loading</div>}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col">
          <div className='flex justify-between w-full'>
            <Button
              variant="secondary"
              onClick={() => {
                postItem(`/settings/mssqlTest`, token, {
                  clientId: connector.clientId,
                  clientPass: connector.clientPass,
                  mssql: connector.mssql,
                })
                  .then(result => setTestResult(`OK\nTablo Isimleri:\n${JSON.stringify(result.recordset, null, 2)}`))
                  .catch(err => setTestResult(`Hata:\n${err}`))
              }}
            >

              <i className="fa-solid fa-database me-2"></i> SQL Test
            </Button>
            <Button onClick={() => {
              putItem(`/settings`, token, { connector: { mssql: connector.mssql } })
                .then((result: SettingType) => {
                  toast({ title: 'Kayıt Başarılı' })
                  setTimeout(() => { window && window.location.reload() }, 700)
                })
                .catch(err => toast({ title: 'error', description: err || '' }))
            }}><i className="fa-solid fa-check"></i></Button>
          </div>
          <div className='w-full mt-2'>
            <pre className='w-full overflow-y-scroll max-h-80 text-sm'>
              {testResult}

            </pre>
          </div>
        </CardFooter>
      </Card>
    }
  </>
  )
}
