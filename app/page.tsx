import { Poppins } from "next/font/google"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
})

export default async function Home() {
  return (
    <main
      className="flex h-full flex-col items-center justify-center 
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background to-background/90"
    >
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold drop-shadow-md",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-lg pb-6">A simple authentication service</p>
        <LoginButton>
          <Button
           
            size="lg"
          >
            {" "}
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  )
}
