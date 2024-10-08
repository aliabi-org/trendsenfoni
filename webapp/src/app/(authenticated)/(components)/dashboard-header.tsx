// "use client"

import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { HeaderLogo2 } from '@/components/logo'
import CustomLink from '@/components/custom-link'
import { Input } from "@/components/ui/input"
import DashboardUserMenu from './dashboard-user-menu'
import { FC } from 'react'
import { UserType } from '@/types/UserType'

interface DashboardHeaderProps {
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-0 md:px-2 dark:border-gray-800 dark:bg-gray-950"    >
      <div className="flex flex-row items-center gap-4">
        <CustomLink className="" href="/home">
          <HeaderLogo2 className='' />
        </CustomLink>
        <nav className=" hidden gap-4 text-sm font-medium md:flex">
          <CustomLink className="rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/home">
            Home
          </CustomLink>
          <CustomLink className="rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/reports">
            Raporlar
          </CustomLink>

          <CustomLink className="rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/settings">
            Ayarlar
          </CustomLink>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* <div>
          <form className="relative hidden md:block">
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"></i>
            <Input
              className="w-full rounded-md bg-gray-100 px-8 py-2 text-sm shadow-none focus:bg-white dark:bg-gray-800 dark:focus:bg-gray-950"
              placeholder="Search..."
              type="search"
            />
          </form>
        </div> */}
        <DashboardUserMenu />
      </div>
    </header>
  )
}

export default DashboardHeader