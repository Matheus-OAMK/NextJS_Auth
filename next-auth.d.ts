import { UserRole } from "@prisma/client"
import { type DefaultSession } from "next-auth"

// This code is required for NextAuth to work with TypeScript when extending
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: UserRole
      isTwoFactorEnabled: boolean
    }
  }
}
