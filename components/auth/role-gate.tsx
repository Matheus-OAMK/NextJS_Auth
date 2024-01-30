"use client"

import { FormError } from "@/components/form-error"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UserRole } from "@prisma/client"

type RoleGateProps = {
  children: React.ReactNode
  allowedRole: UserRole
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const user = useCurrentUser()
  const role = user?.role

  if (role !== allowedRole) {
    return (
      <FormError message="If you see this text, you are not authorized"></FormError>
    )
  }

  return <>{children}</>
}
