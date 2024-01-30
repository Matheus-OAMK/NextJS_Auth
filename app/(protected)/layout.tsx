import { NavBar } from "@/app/(protected)/_components/nav-bar"

type ProtectedLayoutProps = {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <>
      <NavBar />
      <div className="w-full h-full flex flex-col gap-y-10 items-center justify-center ">
        {children}
      </div>
    </>
  )
}

export default ProtectedLayout
