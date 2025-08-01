import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
<<<<<<< HEAD
import { AuthProvider } from "@/lib/auth" // Updated import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Titipsini - Platform Penitipan Barang",
  description: "Platform SaaS untuk mengelola penitipan barang dengan sistem kemitraan",
    generator: 'v0.dev'
=======
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

// Metadata untuk title & favicon
export const metadata: Metadata = {
  title: "Titipsini - Platform Penitipan Barang",
  description: "Platform SaaS untuk mengelola penitipan barang dengan sistem kemitraan",
  generator: "v0.dev",
  icons: {
    icon: "/logotitipsini.png",      // favicon Titipsini
    shortcut: "/logotitipsini.png",
    apple: "/logotitipsini.png",
  },
>>>>>>> master
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
<<<<<<< HEAD
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
=======
      <head>
        {/* Favicon Titipsini */}
        <link rel="icon" href="/logotitipsini.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/logotitipsini.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
>>>>>>> master
      </body>
    </html>
  )
}
