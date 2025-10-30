"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, CalendarDays, QrCode, Shield } from "lucide-react"
import { categories as mockCategories } from "@/lib/data"

interface GoodsItem {
  id: string
  vendorBranchId: string
  userId: string
  categoryId: string
  name: string
  quantity: number
  dateIn: string
  dateOut: string
  dayTotal: number
  paymentMethod: string
  bank: string | null
  status: boolean
  totalPrice: number
  createdAt: string
  vendorBranch: {
    id: string
    vendorId: string
    name: string
    address: string
    phone: string
  }
}

export default function TransactionsPage() {
  const { user, loading } = useAuth()
  const [transactions, setTransactions] = useState<GoodsItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isFetching, setIsFetching] = useState(false)

  // Ambil data vendorId dari token localStorage
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("titipsini_user") : null
  const parsedUser = storedUser ? JSON.parse(storedUser) : null
  const vendorId = parsedUser?.vendorId

  // Fetch data dari endpoint Fastify
  useEffect(() => {
    const fetchTransactions = async () => {
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

        const data = await res.json()
        setTransactions(data.data || [])
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchTransactions()
  }, [user, vendorId])


  // Filter transaksi
  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    return filtered.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vendorBranch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vendorBranch.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && t.status === true) ||
        (filterStatus === "picked_up" && t.status === false)

      return matchesSearch && matchesStatus
    })
  }, [transactions, searchTerm, filterStatus])

  // Loading state
  if (loading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Restrict akses jika bukan vendor
  if (!user || user.role !== "vendor") {
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

  // Badge Status
  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Aktif</Badge>
    }
    return <Badge variant="destructive">Selesai</Badge>
  }

  const getCategoryName = (categoryId: string) => {
    return mockCategories.find((c) => c.id === categoryId)?.name || "Sedang"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>
            <p className="text-gray-600 mt-2">Lihat dan kelola transaksi penitipan barang Anda.</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama barang atau cabang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="picked_up">Selesai</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center font-medium">
              Total: {filteredTransactions.length} transaksi
            </div>
          </div>

          {/* Transactions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-gray-900 text-lg">{transaction.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-purple-500 hover:bg-purple-600 text-xs text-white">
                          {getCategoryName(transaction.categoryId)}
                        </Badge>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(transaction.totalPrice)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>Qty: {transaction.quantity}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>
                        Drop: {new Date(transaction.dateIn).toLocaleDateString("id-ID")} ({transaction.dayTotal} hari)
                      </span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>Pickup: {new Date(transaction.dateOut).toLocaleDateString("id-ID")}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4 text-gray-400" />
                      <span>Metode: {transaction.paymentMethod}</span>
                    </p>
                    {transaction.bank && (
                      <p className="text-xs text-gray-500">Bank: {transaction.bank}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada transaksi ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter pencarian Anda.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
