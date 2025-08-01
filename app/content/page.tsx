"use client"

import { Sidebar } from "@/components/layout/sidebar" // Updated import
import { Header } from "@/components/layout/header" // Updated import
import { useAuth } from "@/lib/auth" // Updated import
import { Globe, Shield } from "lucide-react"

export default function ContentPage() {
  const { user, loading } = useAuth() // Get loading state

  // Handle loading state first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !["superadmin", "admin"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Landing Page</h1>
            <p className="text-gray-600 mt-2">Kelola konten untuk landing page Titipsini.</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center">
            <Globe className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Halaman Landing Page</h3>
            <p className="text-gray-600">Konten untuk landing page akan segera hadir di sini.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
