import pageMeta from '@/lib/meta-info'
import { Metadata } from 'next/types'

export const metadata: Metadata = pageMeta('Dairy')

export default function PageLayout({ children }: { children: any }) {
  return (<>
    <div className='container mx-auto py-8 px-4 md:px-6'>
      {children}
    </div>
  </>)
}
