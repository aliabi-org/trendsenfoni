// import LayoutClientSide from './layout-client'

interface AuthLayoutProps {
  children?: any
}

export default function AuthLayout({ children }: AuthLayoutProps) {

  return (<>
    {children}
  </>)
}


