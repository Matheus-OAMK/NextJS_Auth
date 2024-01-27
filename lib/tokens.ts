import { getVerificationTokenByEmail } from "@/data/verification-token"
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"


export const generatePasswordResetToken = async ( email: string) => {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // Expires in 1hr

  
  const existingToken = await getPasswordResetTokenByEmail(email)

  // Delete existing token if it exists
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    })
  }

  // Create new token in db and return it
  const passwordResetToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return passwordResetToken
}




export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // Expires in 1hr

  const existingToken = await getVerificationTokenByEmail(email)

  // Delete existing token if it exists
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    })
  }

  // Create new token in db and return it
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return verificationToken
}
