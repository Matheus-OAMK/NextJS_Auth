"use client"

import { FaUser } from "react-icons/fa"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LogoutButton } from "@/components/auth/logout-button"

export const UserButton = () => {

  const user = useCurrentUser()
  return (
    <DropdownMenu >
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage className="outline-none" src={user?.image || ""} />
          <AvatarFallback className="bg-primary">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
