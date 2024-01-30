"use server"
import { currentUser } from "@/lib/auth"

export const admin = async () => {
  const user = await currentUser()
  const role = user?.role

  if (role === "ADMIN") {
    return { success: "Authorized" }
  }

  if (role === "USER") {
    return { error: "Unauthorized" }
  }
}
