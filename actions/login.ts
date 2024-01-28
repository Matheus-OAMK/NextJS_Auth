"use server"
import * as z from "zod"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens"
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail"
import { getUserByEmail } from "@/data/user"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate fields
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, code } = validatedFields.data

  // Check if user exists
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "Email does not exist!" }
  }

  // Validate password
  const passwordIsValid = await bcrypt.compare(password, existingUser.password)

  if (!passwordIsValid) {
    return { error: "Invalid credentials!" }
  }

  // If the user exists but has not verified their email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: "Confirmation email sent!" }
  }

  // Check if 2FA is enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      // Return error if the no 2FA code provided or wrong 2FA code
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code!" }
      }

      // Return error if expired code
      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date()
      if (hasExpired) {
        return { error: "Code expired!" }
      }

      // Delete the 2FA code
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      })

      // Get 2FA confirmation
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      // If it already exists delete it
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      // Create 2FA confirmation
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })

      
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  // Finally attempt signIn
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }
    throw error
  }
}
