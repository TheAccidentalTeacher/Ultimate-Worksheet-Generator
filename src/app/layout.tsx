import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homeschool Worksheets AI',
  description: 'Faith-integrated, standards-aligned AI worksheet generator for homeschool families',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
