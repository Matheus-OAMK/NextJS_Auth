"use server"
import * as z from "zod"
import { LoginSchema } from "@/schemas"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)
  setTimeout(() => {}, 1000)
  
  if (!validatedFields.success) {
    return { error: "Invalidated fields" }
  }

  return new Promise(resolve => setTimeout(() => {
    resolve({
      success: "Email sent!",
    })
  }, 5000));
}
