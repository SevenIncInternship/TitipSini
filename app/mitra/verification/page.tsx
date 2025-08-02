"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { mockMitra } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, UserX, Shield, Mail, Phone, MapPin } from "lucide-react"
import type { Mitra } from "@/types"

export default function MitraVerificationPage() {
  const { user, loading } = useAuth()
  const [mitras, setMitras] = useState<Mitra[]>(mockMitra)

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

  const pendingMitras = mitras.filter((m) =>
    ["pending", "pending_payment"].includes(m.status)
  )

  const handleVerifikasi = (id: string) => {
    setMitras(
      mitras.map((m) => (m.id === id ? { ...m, status: "active" } : m))
    )
  }

  const handleTolak = (id: string) => {
    setMitras(
      mitras.map((m) => (m.id === id ? { ...m, status: "suspended" } : m))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Verifikasi Mitra</h1>
            <p className="text-gray-600 mt-2">
              Kelola proses verifikasi mitra baru.
            </p>
          </div>

          {pendingMitras.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingMitras.map((mitra) => (
                <Card key={mitra.id}>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">
                      {mitra.name}
                      <span className="ml-2">
                        {mitra.status === "pending_payment" ? (
                          <Badge className="bg-yellow-500 text-white ml-2">Pending Payment</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{mitra.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{mitra.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{mitra.address}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleVerifikasi(mitra.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Verifikasi
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleTolak(mitra.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center">
              <UserCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada mitra yang menunggu verifikasi
              </h3>
              <p className="text-gray-600">Semua mitra telah diverifikasi.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
