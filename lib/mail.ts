import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL
const fromEmailDomain = process.env.RESEND_EMAIL_DOMAIN

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: `confirm_email${fromEmailDomain}`,
    to: email,
    subject: "Confirm your email",
    html: `
      <h1>Confirm your email</h1>
      <p>Click <a href="${confirmLink}">here </a> to confirm your email.</p>
    `,
  })
}

export const sendPasswodResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: `reset_password${fromEmailDomain}`,
    to: email,
    subject: "Reset your password",
    html: `
    <h1>Confirm password reset</h1>
    <p>Click <a href="${resetLink}"> here <a/> to reset your password.</p>
    `,
  })
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: `2FA${fromEmailDomain}`,
    to: email,
    subject: "2FA Code",
    html: `
    <h1>Your 2FA code: ${token}
    `,
  })
}
