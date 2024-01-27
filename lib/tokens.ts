import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

import { db } from "@/lib/db"
import { getVerificationTokenByEmail } from "@/data/verification-token"
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"



export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // Expires in 1hr

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    })
  }


  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt
    }
  })

  return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // Expires in 1hr

  const existingToken = await getPasswordResetTokenByEmail(email)

  // Delete existing token if it exists
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    })
  }

  // Create new token in db and return it
  const passwordResetToken = await db.passwordResetToken.create({
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
