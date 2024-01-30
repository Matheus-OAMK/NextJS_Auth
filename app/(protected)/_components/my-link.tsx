"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

type MyLinkProps = {
  href: string
  name: string
}

export const MyLink = ({ href, name }: MyLinkProps) => {
  const pathName = usePathname()
  return (
    <Button
      asChild
      variant={pathName === href ? "default" : "ghost"}
    >
      <Link href={href}>{name}</Link>
    </Button>
  )
}
