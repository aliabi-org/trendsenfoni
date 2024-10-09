import { HeaderLogo2 } from '@/components/logo'
import ThemeToggleButton from '@/components/theme-toggle-button'
import pageMeta from '@/lib/meta-info'
import { Metadata } from 'next/types'

export const metadata: Metadata = pageMeta('Register')

export default function MeLayout({ children }: { children: any }) {
  return (<div className={`container py-4`}>
    <div className="container relative  h-screen flex-col justify-center px-6 py-4">
      <div className='absolute end-2 top-2'>
        <ThemeToggleButton />
      </div>
      <div className='absolute start-4 top-2'>
        <HeaderLogo2 className="h-16 w-30" />
      </div>

      {children}
    </div>
  </div>)
}
