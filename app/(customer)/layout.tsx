// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })



export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {


    return (
        <div className="bg-gray-50 min-h-screen flex justify-center">
            <main className="w-full max-w-[430px]  min-h-screen bg-white shadow-lg">
                {children}
            </main>
        </div>

    )
}