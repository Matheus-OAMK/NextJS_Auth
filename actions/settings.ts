"use server"
import bcrypt from "bcryptjs"
import * as z from "zod"

import { SettingsSChema } from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const settings = async (values: z.infer<typeof SettingsSChema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  // If account was created with OAuth, email/password and 2FA can not be modified
  if (user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    // Check if email is already in use
    if (existingUser) {
      return { error: "Email already in use!" }
    }

    // Generate token and send email for confirmation
    const verificationToken = await generateVerificationToken(values.email)

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: "Verification email sent!" }
  }

  // Check if password is correct
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    )

    // If password is not correct return error
    if (!passwordsMatch) {
      return { error: "Incorrect password" }
    }

    // Hash password to store it 
    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined // Remove unwanted field
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  })

  return { success: "Settings Updated!" }
}
