import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `
      <h1>Confirm your email</h1>
      <p>Click <a href="${confirmLink}">here </a> to confirm your email.</p>
    `,
  })
}


export const sendPasswodResetEmail = async (email: string , token:string) => {
  const resetLink = `http://localhost:300/auth/new-password?token=${token}`

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
    <h1>Confirm password reset</h1>
    <p>Click <a href="${resetLink}"> here <a/> to reset your password.</p>
    `
  })
}