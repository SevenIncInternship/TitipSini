// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })



export default function VendorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    

    return (
        <main className="w-full ">{children}</main>
    )
}