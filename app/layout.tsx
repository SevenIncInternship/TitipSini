// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Titipsini - Platform Penitipan Barang",
  description: "Platform SaaS untuk mengelola penitipan barang dengan sistem kemitraan",
  generator: "v0.dev",
  icons: {
    icon: "/logotitipsini.png",        // favicon Titipsini
    shortcut: "/logotitipsini.png",
    apple: "/logotitipsini.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}