"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Search, CheckCircle } from "lucide-react"
import { mockInvoices, mockMitra } from "@/lib/data"
import type { Invoice } from "@/types"

export default function InvoicesPage() {
  const { user, loading } = useAuth() // Get loading state
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Handle loading state first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Now that loading is false, check user and role
  if (!user || !["superadmin", "finance", "mitra"].includes(user.role)) {
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

  const filteredInvoices = useMemo(() => {
    let filtered = invoices

    if (user.role === "mitra") {
      filtered = filtered.filter((invoice) => invoice.mitraId === user.id) // Assuming user.id matches mitraId
    }

    return filtered.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mockMitra
          .find((m) => m.id === invoice.mitraId)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [invoices, searchTerm, filterStatus, user])

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: "paid", paidAt: new Date() } : inv)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Lunas</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Jatuh Tempo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMitraName = (mitraId: string) => {
    return mockMitra.find((m) => m.id === mitraId)?.name || "N/A"
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
            <h1 className="text-3xl font-bold text-gray-900">Invoice & Pembayaran</h1>
            <p className="text-gray-600 mt-2">Kelola semua invoice dan status pembayaran.</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nomor invoice atau mitra..."
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
              <option value="pending">Pending</option>
              <option value="paid">Lunas</option>
              <option value="overdue">Jatuh Tempo</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center font-medium">
              Total: {filteredInvoices.length} invoice
            </div>
          </div>

          {/* Invoices List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-gray-900 text-lg">{invoice.invoiceNumber}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(invoice.status)}
                        {user.role !== "mitra" && (
                          <span className="text-sm text-gray-600">untuk {getMitraName(invoice.mitraId)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(invoice.amount)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Jatuh Tempo:</span> {invoice.dueDate.toLocaleDateString("id-ID")}
                    </p>
                    {invoice.status === "paid" && invoice.paidAt && (
                      <p>
                        <span className="font-medium">Dibayar Pada:</span> {invoice.paidAt.toLocaleDateString("id-ID")}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Dibuat:</span> {invoice.createdAt.toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  {(user.role === "superadmin" || user.role === "finance") && invoice.status === "pending" && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white w-full"
                        onClick={() => handleMarkAsPaid(invoice.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Tandai Sebagai Lunas
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada invoice ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
