"use client"

import { useRef, useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { FileText, Shield, Package, Users, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockDashboardStats, mockInvoices, mockTransactions, mockMitra } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import html2pdf from "html2pdf.js"
import { User } from "@/types"
import router from "next/router"

export default function ReportsPage() {
  const { user, loading } = useAuth() // Get loading state
  const reportContentRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  // Handle loading state first
  useEffect(() => {
  if (!loading && (!user || !["superadmin", "admin"].includes(user.role))) {
      router.replace("/login")
    }
  }, [user, loading])

  if (loading || !user || !["superadmin", "admin"].includes(user.role)) {
    return null
  }



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMitraName = (mitraId: string) => {
    return mockMitra.find((m) => m.id === mitraId)?.name || "N/A"
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

  const getTransactionStatusBadge = (status: string) => {
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

  const handlePrintPdf = async () => {
    if (!reportContentRef.current) return
    setIsPrinting(true)

    try {
      const html2pdf = (await import("html2pdf.js")).default

      html2pdf()
        .from(reportContentRef.current)
        .set({
          margin: 1,
          filename: `Laporan_Titipsini_${user.role}_${new Date().toLocaleDateString("id-ID")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .finally(() => setIsPrinting(false))
    } catch (err) {
      console.error("Gagal mencetak PDF:", err)
      setIsPrinting(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
              <p className="text-gray-600 mt-2">Lihat berbagai laporan dan analitik.</p>
            </div>
            <Button onClick={handlePrintPdf} disabled={isPrinting} className="green-gradient hover:opacity-90">
              {isPrinting ? (
                "Mencetak..."
              ) : (
                <>
                  <Printer className="h-4 w-4 mr-2" /> Cetak PDF
                </>
              )}
            </Button>
          </div>

          <div ref={reportContentRef} className="bg-white p-6 rounded-lg shadow-sm">
            {" "}
            {/* Content to be printed */}
            {/* Finance/Superadmin Reports */}
            {(user.role === "superadmin" || user.role === "finance") && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Keuangan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Total Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(mockDashboardStats.totalInvoiceAmount)}</div>
                      <p className="text-xs opacity-90 mt-1">Total tagihan yang diterbitkan</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Jumlah Dibayar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(mockDashboardStats.paidAmount)}</div>
                      <p className="text-xs opacity-90 mt-1">Total pembayaran diterima</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(mockDashboardStats.outstandingAmount)}</div>
                      <p className="text-xs opacity-90 mt-1">Total yang belum dibayar</p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Terbaru</h2>
                <div className="space-y-4 mb-8">
                  {mockInvoices.slice(0, 3).map((invoice) => (
                    <Card key={invoice.id} className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-800 font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">Untuk: {getMitraName(invoice.mitraId)}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-green-600">{formatCurrency(invoice.amount)}</span>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {/* Admin/Superadmin Reports */}
            {(user.role === "superadmin" || user.role === "admin") && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Operasional</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Mitra</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">{mockDashboardStats.totalMitra}</div>
                      <Users className="h-6 w-6 text-green-500" />
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Transaksi Harian</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">{mockDashboardStats.dailyTransactions}</div>
                      <Package className="h-6 w-6 text-blue-500" />
                    </CardContent>
                  </Card>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaksi Terbaru</h2>
                <div className="space-y-4 mb-8">
                  {mockTransactions.slice(0, 3).map((transaction) => (
                    <Card key={transaction.id} className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-gray-800 font-medium">{transaction.customerName}</p>
                          <p className="text-sm text-gray-600">{transaction.itemDescription}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(transaction.totalAmount)}
                          </span>
                          {getTransactionStatusBadge(transaction.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {/* Mitra Specific Reports */}
            {user.role === "mitra" && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Laporan Transaksi Saya</h2>
                <div className="space-y-4 mb-8">
                  {mockTransactions
                    .filter((t) => mockMitra.find((m) => m.id === t.branchId)?.id === user.id)
                    .slice(0, 5)
                    .map((transaction) => (
                      <Card key={transaction.id} className="bg-white border border-gray-200 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-gray-800 font-medium">{transaction.customerName}</p>
                            <p className="text-sm text-gray-600">{transaction.itemDescription}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(transaction.totalAmount)}
                            </span>
                            {getTransactionStatusBadge(transaction.status)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {mockTransactions.filter((t) => mockMitra.find((m) => m.id === t.branchId)?.id === user.id).length ===
                    0 && <div className="text-center py-6 text-gray-500">Tidak ada transaksi untuk ditampilkan.</div>}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Laporan Invoice Saya</h2>
                <div className="space-y-4 mb-8">
                  {mockInvoices
                    .filter((inv) => inv.mitraId === user.id)
                    .slice(0, 5)
                    .map((invoice) => (
                      <Card key={invoice.id} className="bg-white border border-gray-200 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-gray-800 font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-600">
                              Jatuh Tempo: {invoice.dueDate.toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-green-600">{formatCurrency(invoice.amount)}</span>
                            {getStatusBadge(invoice.status)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {mockInvoices.filter((inv) => inv.mitraId === user.id).length === 0 && (
                    <div className="text-center py-6 text-gray-500">Tidak ada invoice untuk ditampilkan.</div>
                  )}
                </div>
              </>
            )}
            {/* Generic message if no specific reports are available for the role */}
            {user.role === "mitra" &&
              mockTransactions.filter((t) => mockMitra.find((m) => m.id === t.branchId)?.id === user.id).length === 0 &&
              mockInvoices.filter((inv) => inv.mitraId === user.id).length === 0 && (
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada laporan untuk ditampilkan</h3>
                  <p className="text-gray-500">Data laporan Anda akan muncul di sini setelah ada aktivitas.</p>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  )
}


