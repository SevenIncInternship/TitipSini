"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar" // Updated import
import { Header } from "@/components/layout/header" // Updated import
import { useAuth } from "@/lib/auth" // Updated import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, UserX, UserCheck, Building2, Phone, Mail, MapPin } from "lucide-react"
import { mockMitra, tierPlans } from "@/lib/data" // Updated import
import type { Mitra } from "@/types" // Updated import

export default function MitraPage() {
  const { user, loading } = useAuth() // Get loading state
  const [mitras, setMitras] = useState<Mitra[]>(mockMitra)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTier, setFilterTier] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Handle loading state first
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
          <Building2 className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    )
  }

  const filteredMitras = mitras.filter((mitra) => {
    const matchesSearch =
      mitra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mitra.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === "all" || mitra.tier === filterTier
    const matchesStatus = filterStatus === "all" || mitra.status === filterStatus

    return matchesSearch && matchesTier && matchesStatus
  })

  const handleSuspendMitra = (mitraId: string) => {
    setMitras(mitras.map((m) => (m.id === mitraId ? { ...m, status: "suspended", suspendedAt: new Date() } : m)))
  }

  const handleRestoreMitra = (mitraId: string) => {
    setMitras(mitras.map((m) => (m.id === mitraId ? { ...m, status: "active", suspendedAt: undefined } : m)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Aktif</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "pending_payment":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending Payment</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTierInfo = (tierName: string) => {
    return tierPlans.find((t) => t.name === tierName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">List Mitra</h1>
            <p className="text-gray-600 mt-2">Kelola semua mitra terdaftar</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari mitra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Semua Tier</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center font-medium">
              Total: {filteredMitras.length} mitra
            </div>
          </div>

          {/* Mitra Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMitras.map((mitra) => {
              const tierInfo = getTierInfo(mitra.tier)

              return (
                <Card
                  key={mitra.id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 text-lg">{mitra.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-xs text-white">
                              {mitra.tier.toUpperCase()}
                            </Badge>
                            {getStatusBadge(mitra.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
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

                      {tierInfo && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                          <div className="text-xs text-green-600 mb-1 font-medium">
                            Paket {tierInfo.name.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-900 font-semibold">
                            Rp {tierInfo.monthlyPrice.toLocaleString("id-ID")}/bulan
                          </div>
                          <div className="text-xs text-gray-600">Maksimal {tierInfo.maxBranches} cabang</div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Bergabung: {mitra.createdAt.toLocaleDateString("id-ID")}
                      </div>
                    </div>

                    {/* Actions */}
                    {(user.role === "superadmin" || user.role === "admin") && (
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </Button>

                        {mitra.status === "active" ? (
                          <Button size="sm" variant="destructive" onClick={() => handleSuspendMitra(mitra.id)}>
                            <UserX className="h-3 w-3 mr-1" />
                            Suspend
                          </Button>
                        ) : mitra.status === "suspended" ? (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleRestoreMitra(mitra.id)}
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Restore
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredMitras.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada mitra ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
