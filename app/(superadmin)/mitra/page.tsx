"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
} from "lucide-react"

type Mitra = {
  id: string
  userId: string
  companyName: string
  companyAddress: string
  phone: string
  email: string
  createdAt: string
}

export default function MitraPage() {
  const { user, loading } = useAuth()
  const [mitras, setMitras] = useState<Mitra[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setMitras(data)
      })
      .catch((err) => console.error("Gagal ambil data Mitra:", err))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !["superadmin", "admin", "finance"].includes(user.role)) {
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

  const filteredMitras = mitras.filter((mitra) =>
    mitra.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mitra.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64  p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">List Mitra</h1>
            <p className="text-gray-600 mt-2">Kelola semua mitra terdaftar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari mitra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600 flex items-center font-medium">
              Total: {filteredMitras.length} mitra
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMitras.map((mitra) => (
              <Card
                key={mitra.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 text-lg">
                          {mitra.companyName}
                        </CardTitle>
                        <Badge className="bg-blue-500 text-white text-xs">Vendor</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {mitra.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {mitra.phone}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      {mitra.companyAddress}
                    </div>

                    <div className="text-xs text-gray-500">
                      Bergabung: {new Date(mitra.createdAt).toLocaleDateString("id-ID")}
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMitras.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada mitra ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
