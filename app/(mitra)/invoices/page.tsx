"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Search } from "lucide-react"

interface Goods {
  id: string
  name: string
  totalPrice: number
  status: boolean
  dateIn: string
  dateOut: string
  createdAt: string
  vendorBranch?: {
    id: string
    name: string
  }
}

export default function InvoicesPage() {
  const { user, loading } = useAuth()
  const [invoices, setInvoices] = useState<Goods[]>([])
  const [isFetching, setIsFetching] = useState(false)

  // ambil vendor_id dari localStorage
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("titipsini_user") : null
  const parsedUser = storedUser ? JSON.parse(storedUser) : null
  const vendorId = parsedUser?.vendorId


  // fetch data invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user || user.role !== "vendor" || !vendorId) return

      setIsFetching(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/goods?vendorId=${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
            },
          }
        )
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setInvoices(data.data || [])
      } catch (error) {
        console.error("Failed to fetch invoices:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchInvoices()
  }, [user, vendorId])

  const getStatusBadge = (status: boolean) => {
    if (status === false)
      return <Badge className="bg-green-500 text-white">Lunas</Badge>
    if (status === true)
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>
    return <Badge variant="outline">Tidak Diketahui</Badge>
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  // pastikan hook di atas return
  if (loading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || user.role !== "vendor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Invoice & Pembayaran
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola semua invoice dan status pembayaran Anda.
            </p>
          </div>

          {/* Filter UI (dummy — tidak aktif) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama barang atau cabang..."
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <select
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-green-500 focus:ring-green-500"
            >
              <option>Semua Status</option>
              <option>Pending</option>
              <option>Lunas</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center font-medium">
              Total: {invoices.length} transaksi
            </div>
          </div>

          {/* Daftar Invoice */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {invoices.map((inv) => (
              <Card
                key={inv.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-gray-900 text-lg">
                        {inv.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(inv.status)}
                        {inv.vendorBranch && (
                          <span className="text-sm text-gray-600">
                            {inv.vendorBranch.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(inv.totalPrice)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Tanggal Masuk:</span>{" "}
                      {new Date(inv.dateIn).toLocaleDateString("id-ID")}
                    </p>
                    <p>
                      <span className="font-medium">Tanggal Keluar:</span>{" "}
                      {new Date(inv.dateOut).toLocaleDateString("id-ID")}
                    </p>
                    <p>
                      <span className="font-medium">Dibuat:</span>{" "}
                      {new Date(inv.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {invoices.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Tidak ada transaksi ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah filter atau kata pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
