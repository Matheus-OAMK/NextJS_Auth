"use client"
import { useCallback, useEffect, useState, CSSProperties } from "react"
import { useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { newVerification } from "@/actions/new-verification"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(async () => {
    setError("")
    setSuccess("")

    if (!token) {
      setError("Missing token!")
      return
    }

    try {
      const { error, success } = await newVerification(token)

      if (error) {
        setError(error)
      }

      if (success) {
        setSuccess(success)
      }
    } catch (error) {
      setError("Something went wrong!")
    }
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])
  return (
    <CardWrapper
      headerLabel="Confirm your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader color="#7C3AED" />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}
