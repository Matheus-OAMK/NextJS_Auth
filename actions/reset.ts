"use server"

import * as z from "zod"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export const reset = async(values: z.infer<typeof ResetSchema>) => {
  const validatedFields= ResetSchema.safeParse(values)


  // Check if for valid email
  if(!validatedFields.success) {
    return {error : "Invalid email!"}
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  // Check if user exists
  if(!existingUser) {
    return {error : "Email not found!"}
  }

  // TODO Genreate reset token and send email

  return {success : "Password reset email sent!"}
}