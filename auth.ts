import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"

import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      // Update user to have emailVerified when using a provider
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider === "credentials") {
        return true
      }

      const existingUser = await getUserById(user.id)

      if (!existingUser?.emailVerified) {
        return false
      }

      // 2FA check

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        )

        if (!twoFactorConfirmation) {
          return false
        }

        // Remove 2FA after signin
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },

    async session({ session, token}) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole // Couldnt extend JWT types
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean // Couldnt extend JWT types
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
      token.isTwoFactorEnabled = isExistingUser.isTwoFactorEnabled
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
