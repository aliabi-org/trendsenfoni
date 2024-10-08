"use client"
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { getItem, getList, postItem, putItem } from '@/lib/fetch'
import Cookies from 'js-cookie'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatabaseType } from '@/types/DatabaseType'
import { Button } from '@/components/ui/button'

export function DatabaseSelect() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [dbList, setDbList] = useState<DatabaseType[]>([])
  const [db, setDb] = useState<DatabaseType>()
  const { toast } = useToast()

  const loadDbList = () => {
    setLoading(true)
    getList(`/dbList`, token)
      .then((result: DatabaseType[]) => {
        console.log('result:', result)
        setDbList(result)
        Cookies.set('dbList', JSON.stringify(result))
        const foundDb = result.find(k => k.db === db?.db)
        if (!foundDb) {
          setDb(result[0])
          Cookies.set('db', JSON.stringify(result[0]))
        }
      })
      .catch(err => toast({ title: 'Error', description: err }))
      .finally(() => setLoading(false))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    try {
      setLoading(true)
      if (token) {
        if (Cookies.get('dbList')) {
          let list = JSON.parse(Cookies.get('dbList') || '[]') as DatabaseType[]
          setDbList(list)
          if (Cookies.get('db')) {
            const foundDb = list.find(k => k.db === db?.db)
            setDb(foundDb)
          } else {
            setDb(list[0])
            Cookies.set('db', JSON.stringify(list[0]))
          }

        } else {

          setDbList([])
          setDb(undefined)
          Cookies.set('db', '')
          loadDbList()
        }
      }
    } catch (err) {
      console.log('hata:', err)
    }
    setLoading(false)
  }, [token])
  return (<div className='flex flex-col'>
    <div className='flex flex-row gap-2 min-w-48'>
      <Select

        defaultValue={db?.db}
        onValueChange={e => {
          const database = dbList.find(k => k.db === e)
          setDb(database)
          if (database) {
            Cookies.set('db', JSON.stringify(database))
          } else {
            Cookies.set('db', '')
          }
        }}
      >
        <SelectTrigger className='text-xs' >
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent className='text-xs' position="popper">
          {dbList.map((e, index) => <SelectItem key={e.db} value={e.db || ''}>{e.dbName}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant={'outline'} onClick={loadDbList}><i className="fa-solid fa-rotate"></i></Button>
    </div>
    {db && <div>{db.db}</div>}
  </div>)
}