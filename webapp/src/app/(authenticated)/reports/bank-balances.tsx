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
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { getItem, getList } from '@/lib/fetch'


export function BankBalances() {
  const [token, setToken] = useState('')
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getList('/reports/bankBalances', token)
        .then(result => {
          console.log('result:', result)
          setList(result)
        })
        .catch(err => console.log(err))
    }
  }, [token])
  return (
    <Table className='overflow-hidden'>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="">Banka</TableHead>
          <TableHead className="text-right">Bakiye</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='overflow-hidden'>
        {list && list.map((e) => (
          <TableRow key={e.Banka}>
            <TableCell className="font-medium text-wrap">{e.Banka}</TableCell>
            <TableCell className="text-right">{e.Bakiye} {e.ParaBirimi}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
  )
}
