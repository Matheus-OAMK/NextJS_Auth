import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ToggleModeButton } from "@/components/toggle-mode-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuthJS-V5",
  description: "Authentication implemented with AuthJS",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html
        lang="en"
        suppressHydrationWarning={true}
      >
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
           
          >
            {children}{" "}
            <Toaster />
            <ToggleModeButton />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
