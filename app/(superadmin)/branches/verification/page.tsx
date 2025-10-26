"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { mockBranches } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, CheckCircle, XCircle, Shield } from "lucide-react"

export default function BranchesVerificationPage() {
  const { user, loading } = useAuth()
  const [branches, setBranches] = useState(mockBranches)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
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

  const handleVerifikasi = (id: string) => {
    setBranches(
      branches.map((b) =>
        b.id === id ? { ...b, status: "active" } : b
      )
    )
  }

  const handleTolak = (id: string) => {
    setBranches(
      branches.map((b) =>
        b.id === id ? { ...b, status: "rejected" } : b
      )
    )
  }

  const pendingBranches = branches.filter((b) => b.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Verifikasi Cabang</h1>
            <p className="text-gray-600 mt-2">Kelola proses verifikasi cabang mitra.</p>
          </div>

          {pendingBranches.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center">
              <MapPin className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Cabang Menunggu</h3>
              <p className="text-gray-600">Semua cabang mitra telah diverifikasi atau ditolak.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingBranches.map((branch) => (
                <Card key={branch.id} className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900">{branch.name}</CardTitle>
                        <Badge className="mt-1 text-xs bg-yellow-500 text-white">Pending</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {branch.address}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white w-full"
                        onClick={() => handleVerifikasi(branch.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verifikasi
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleTolak(branch.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
