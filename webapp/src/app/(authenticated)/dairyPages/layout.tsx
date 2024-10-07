import pageMeta from '@/lib/meta-info'
import { Metadata } from 'next/types'

export const metadata: Metadata = pageMeta('Databases')

export default function PageLayout({ children }: { children: any }) {
  return (<>
    <div className='container mx-auto py-1 md:py-8 px-2 md:px-6'>
      {children}
    </div>
  </>)
}
