import NextAuth from "next-auth"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"

import { getUserById } from "@/data/user"



export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole // Couldnt extend JWT types
      }
      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const isExistingUser = await getUserById(token.sub)

      if (!isExistingUser) {
        return token
      }

      token.role = isExistingUser.role
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
