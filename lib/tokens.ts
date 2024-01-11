import { getVerificationTokenByEmail } from "@/data/verification-token"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // Expires in 1hr

  const existingToken = await getVerificationTokenByEmail(email)

  // Delete existing token if it exists
  if (existingToken) {
    await db.verifcationToken.delete({
      where: { id: existingToken.id },
    })
  }

  // Create new token in db and return it
  const verificationToken = await db.verifcationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return verificationToken
}
