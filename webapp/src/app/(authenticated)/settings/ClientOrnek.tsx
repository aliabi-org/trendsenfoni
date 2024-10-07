// "use client"

// import Cookies from "js-cookie"
import { FC } from 'react'


export interface ClientExampleProps {
  token?: string
}
export const ClientExample: FC<ClientExampleProps> = ({ token }) => {
  // const tk = Cookies.get('token')

  return (<div>
    <h2>client ornek</h2>
    {/* <pre>token:{tk}</pre> */}
    <pre>prop token:{token}</pre>
  </div>)
}

export default ClientExample