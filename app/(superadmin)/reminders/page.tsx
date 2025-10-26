"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Bell, Shield, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Reminder {
  id: string
  message: string
  date: Date
  isRead: boolean
}

const mockReminders: Reminder[] = [
  {
    id: "1",
    message: "Invoice #INV-2024-002 dari Warung Bu Ina jatuh tempo besok.",
    date: new Date("2025-07-30T09:00:00"),
    isRead: false,
  },
  {
    id: "2",
    message: "Mitra baru Toko Maju Jaya telah mendaftar dan menunggu verifikasi.",
    date: new Date("2025-07-29T14:30:00"),
    isRead: false,
  },
  {
    id: "3",
    message: "Laporan keuangan bulanan siap diunduh.",
    date: new Date("2025-07-28T10:00:00"),
    isRead: true,
  },
  {
    id: "4",
    message: "Cabang baru Sari Jaya Thamrin menunggu verifikasi lokasi.",
    date: new Date("2025-07-27T16:00:00"),
    isRead: false,
  },
]

export default function RemindersPage() {
  const { user, loading } = useAuth() // Get loading state
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)

  // Handle loading state first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !["superadmin", "finance"].includes(user.role)) {
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

  const handleMarkAsRead = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, isRead: true } : r)))
  }

  const handleDismiss = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  const unreadReminders = reminders.filter((r) => !r.isRead)
  const readReminders = reminders.filter((r) => r.isRead)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pengingat</h1>
            <p className="text-gray-600 mt-2">Kelola pengingat dan notifikasi sistem.</p>
          </div>

          {unreadReminders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Belum Dibaca ({unreadReminders.length})</h2>
              <div className="space-y-4">
                {unreadReminders.map((reminder) => (
                  <Card key={reminder.id} className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{reminder.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {reminder.date.toLocaleDateString("id-ID")} {reminder.date.toLocaleTimeString("id-ID")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(reminder.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Tandai Dibaca
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDismiss(reminder.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {readReminders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sudah Dibaca ({readReminders.length})</h2>
              <div className="space-y-4">
                {readReminders.map((reminder) => (
                  <Card key={reminder.id} className="bg-gray-100 border border-gray-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-gray-600">{reminder.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {reminder.date.toLocaleDateString("id-ID")} {reminder.date.toLocaleTimeString("id-ID")}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDismiss(reminder.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {reminders.length === 0 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada pengingat</h3>
              <p className="text-gray-500">Semua pengingat sudah ditangani.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
