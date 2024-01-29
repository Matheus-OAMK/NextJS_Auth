export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="h-full flex items-center justify-center
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background to-background/50"
    >
      {children}
    </div>
  )
}
