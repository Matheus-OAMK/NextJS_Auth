import { type DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "./ui/badge"

type UserInfoProp = {
  user?: DefaultSession["user"] & {
    role: UserRole
    isTwoFactorEnabled: boolean
  }
  label: string
}

export const UserInfo = ({user, label} : UserInfoProp) => {
  return(
    <Card className="w-[70%]">
      <CardHeader>
        <p className="text-2xl font font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex flex-row items-center justify-between border-b border-border/40 p-3 shadow-sm ">
          <p className="text-sm font-medium">ID</p>
          <p className="truncate max-w-[200px] text-xs">{user?.id}</p>
        </div>

        <div className="flex flex-row items-center justify-between border-b border-border/40 p-3 shadow-sm ">
          <p className="text-sm font-medium">Email</p>
          <p className="truncate max-w-[200px]  text-xs">{user?.email}</p>
        </div>

        <div className="flex flex-row items-center justify-between border-b border-border/40 p-3 shadow-sm ">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate max-w-[200px] text-xs">{user?.name}</p>
        </div>

        <div className="flex flex-row items-center justify-between border-b border-border/40 p-3 shadow-sm ">
          <p className="text-sm font-medium">Two-Factor-Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"} className="text-xs">{user?.isTwoFactorEnabled ? "ON" : "OFF"}</Badge>
        </div>

        <div className="flex flex-row items-center justify-between  px-3 pt-3 shadow-sm ">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate max-w-[200px] text-xs">{user?.role}</p>
        </div>

      </CardContent>
    </Card>
  )
}
