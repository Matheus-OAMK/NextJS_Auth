"use server"

import * as z from "zod"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswodResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  // Check if for valid email
  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  // Check if user exists
  if (!existingUser) {
    return { error: "Email not found!" }
  }

  // Genreate reset token and send email
  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswodResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: "Password reset email sent!" }
}
