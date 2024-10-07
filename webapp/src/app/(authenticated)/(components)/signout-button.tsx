// "use client"

// import * as React from "react"

import { Button } from "@/components/ui/button"
import { authSignOut } from '@/lib/authHelper'
// import Cookies from 'js-cookie'
import { cookies } from 'next/headers'
import { useRouter, redirect } from 'next/navigation'
interface SignOutButtonProps {
  className?: string
  title?: string
}
export default function SignOutButton({ className = '', title = 'Exit' }: SignOutButtonProps) {
  // const router = useRouter()
  return (
    <form action={async () => {
      "use server"
      authSignOut()
      redirect('/auth/login')
    }}>
      <Button type="submit" variant="outline" size="icon"
        className={`${className}`}
        title={title}

      >
        <i className='fa-solid fa-power-off'></i>
      </Button>
    </form>
  )
}


