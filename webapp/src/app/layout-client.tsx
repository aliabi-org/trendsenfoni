"use client"

import React, { useEffect, useState } from "react"
// import { SessionProvider, useSession } from "next-auth/react"
import { RedirectType, redirect, usePathname, useRouter } from "next/navigation"
import { eventLog, consoleLogWelcomeMsg } from '@/lib/log'
import Cookies from 'js-cookie'
const ComponentForSessionProvider = () => {
  // const { data: session, update, status } = useSession()
  const [welcomeMsg, setWelcomeMsg] = useState(false)
  const yol = usePathname()
  if (!welcomeMsg) {
    setWelcomeMsg(true)
    consoleLogWelcomeMsg()
  }


  // useEffect(()=>{
  //   if(!welcomeMsg){
  //     setWelcomeMsg(true)
  //     consoleLogWelcomeMsg()
  //   }
  // },[])
  return <></>
}

const LayoutClientSide = () => {
  const router = useRouter()
  const pathName = usePathname()
  if (Cookies.get('token') && pathName.startsWith('/auth')) {
    router.push('/home')
  }
  return <>
    <ComponentForSessionProvider />
  </>
}


export default LayoutClientSide
