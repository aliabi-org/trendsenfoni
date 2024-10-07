import Link from 'next/link'

export type IconProps = React.HTMLAttributes<SVGElement> & { width?: number, height?: number }

export const HeaderLogo2 = ({
  className,
}: { className?: string }) => {
  return (
    <div className={`flex flex-row ${className}`}>
      {/* <LogoIcon /> */}
      {/* <img className='aspect-auto' src={'/img/icon.png'} alt={'MentalAbi'} /> */}
      <div className='text-2xl '>
        {/* {process.env.NEXT_PUBLIC_APP_TITLE || 'ENV ERROR'} */}
        <span className='bg-purple-600 text-white p-1 rounded-tl-sm rounded-bl-sm font-semibold'>Trend</span>
        <span className='bg-yellow-600 text-black p-1 rounded-tr-sm rounded-br-sm font-semibold'>Senfoni</span>
      </div>
    </div>
  )
}