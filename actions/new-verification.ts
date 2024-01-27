"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"

export const newVerification = async (token: string) => {
  //Check if token exists
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: "Token does not exist!" }
  }

  // Check if token has expired
  const hasExpired = new Date(existingToken.expiresAt) < new Date()

  if (hasExpired) {
    return { error: "Token has expired!" }
  }

  // Check if user exists
  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  // Update user with verified email

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })

  // Delete token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  })

  return { success: "Email verified!" }
}