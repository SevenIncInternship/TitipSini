"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, CalendarDays, QrCode, Shield } from "lucide-react"
import { mockTransactions, mockBranches, categories as mockCategories } from "@/lib/data"
import type { Transaction } from "@/types"

export default function TransactionsPage() {
  const { user, loading } = useAuth() // Get loading state
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const userBranches = useMemo(() => {
    if (user && user.role === "mitra") {
      return mockBranches.filter((branch) => branch.mitraId === user.id)
    }
    return []
  }, [user])

  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    if (user && user.role === "mitra") {
      const userBranchIds = userBranches.map((b) => b.id)
      filtered = filtered.filter((t) => userBranchIds.includes(t.branchId))
    }

    return filtered.filter((t) => {
      const matchesSearch =
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || t.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [transactions, searchTerm, filterStatus, user, userBranches])

  // Handle loading state first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Now that loading is false, check user and role
  if (!user || user.role !== "mitra") {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Aktif</Badge>
      case "picked_up":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Diambil</Badge>
      case "overdue":
        return <Badge variant="destructive">Jatuh Tempo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryName = (categoryId: string) => {
    return mockCategories.find((c) => c.id === categoryId)?.name || "N/A"
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
                placeholder="Cari nama pelanggan, barang, atau QR Code..."
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
              <option value="picked_up">Diambil</option>
              <option value="overdue">Jatuh Tempo</option>
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
                      <CardTitle className="text-gray-900 text-lg">{transaction.customerName}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-purple-500 hover:bg-purple-600 text-xs text-white">
                          {getCategoryName(transaction.categoryId)}
                        </Badge>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(transaction.totalAmount)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{transaction.itemDescription}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>
                        Drop: {transaction.dropDate.toLocaleDateString("id-ID")} ({transaction.duration} hari)
                      </span>
                    </p>
                    {transaction.pickupDate && (
                      <p className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span>Pickup: {transaction.pickupDate.toLocaleDateString("id-ID")}</span>
                      </p>
                    )}
                    <p className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4 text-gray-400" />
                      <span>QR Code: {transaction.qrCode}</span>
                    </p>
                    {transaction.notes && <p className="text-xs text-gray-500">Catatan: {transaction.notes}</p>}
                  </div>
                  {/* Add action buttons here if needed, e.g., Mark as Picked Up */}
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
