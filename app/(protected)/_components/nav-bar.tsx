"use client"
import { MyLink } from "@/app/(protected)/_components/my-link"
import { UserButton } from "@/components/auth/user-button"

const navLinks = [
  {
    name: "Client",
    href: "/client",
  },
  {
    name: "Server",
    href: "/server",
  },
  {
    name: "Admin",
    href: "/admin",
  },
  {
    name: "Settings",
    href: "/settings",
  },
]

export const NavBar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-8 rounded-xl w-full top-0 sticky shadow-sm">
      <div className="flex gap-x-3">
        {navLinks.map(link => {
          return (
            <MyLink
              href={link.href}
              name={link.name}
              key={link.href}
            ></MyLink>
          )
        })}
      </div>
      <UserButton />
    </nav>
  )
}
