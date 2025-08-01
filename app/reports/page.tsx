"use client"

import { useRef, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { FileText, Shield, Package, Users, Printer, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockDashboardStats, mockInvoices, mockTransactions, mockMitra } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

// Dynamic import untuk html2pdf agar hanya dimuat di sisi klien
const html2pdfPromise = typeof window !== "undefined" ? import("html2pdf.js") : Promise.resolve(null)

// Helper untuk format mata uang Rupiah
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)

// Helper untuk mendapatkan nama Mitra dari ID
const getMitraName = (mitraId: string) => mockMitra.find((m) => m.id === mitraId)?.name || "N/A"

// Helper untuk badge status invoice
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

// Helper untuk badge status transaksi
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

// Komponen untuk Ringkasan Keuangan
function FinancialSummary() {
  return (
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
    </>
  )
}

// Komponen untuk Invoice Terbaru
function LatestInvoices() {
  return (
    <>
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
  )
}

// Komponen untuk Ringkasan Operasional
function OperationalSummary() {
  return (
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
    </>
  )
}

// Komponen untuk Transaksi Terbaru
function LatestTransactions() {
  return (
    <>
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
                <span className="text-lg font-bold text-green-600">{formatCurrency(transaction.totalAmount)}</span>
                {getTransactionStatusBadge(transaction.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

// Komponen untuk Transaksi Mitra
function MitraTransactions({ userId }: { userId: string }) {
  const filteredTransactions = useMemo(
    () => mockTransactions.filter((t) => mockMitra.find((m) => m.id === t.branchId)?.id === userId),
    [userId]
  )

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Laporan Transaksi Saya</h2>
      <div className="space-y-4 mb-8">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.slice(0, 5).map((transaction) => (
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
          ))
        ) : (
          <EmptyReportMessage message="Tidak ada transaksi untuk ditampilkan." />
        )}
      </div>
    </>
  )
}

// Komponen untuk Invoice Mitra
function MitraInvoices({ userId }: { userId: string }) {
  const filteredInvoices = useMemo(() => mockInvoices.filter((inv) => inv.mitraId === userId), [userId])

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Laporan Invoice Saya</h2>
      <div className="space-y-4 mb-8">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.slice(0, 5).map((invoice) => (
            <Card key={invoice.id} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">Jatuh Tempo: {invoice.dueDate.toLocaleDateString("id-ID")}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-green-600">{formatCurrency(invoice.amount)}</span>
                  {getStatusBadge(invoice.status)}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyReportMessage message="Tidak ada invoice untuk ditampilkan." />
        )}
      </div>
    </>
  )
}

// Komponen untuk pesan laporan kosong
function EmptyReportMessage({ message }: { message: string }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">Tidak ada laporan untuk ditampilkan</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

// Komponen utama ReportsPage
export default function ReportsPage() {
  const { user, loading } = useAuth()
  const reportContentRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !["superadmin", "admin", "finance", "mitra"].includes(user.role)) {
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

  const generatePdf = async (action: "preview" | "download") => {
    if (typeof window === "undefined" || !reportContentRef.current) return

    setIsProcessing(true)
    const html2pdf = (await html2pdfPromise)?.default

    if (!html2pdf) {
      console.error("html2pdf.js tidak dimuat.")
      setIsProcessing(false)
      return
    }

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Laporan_Titipsini_${user.role}_${new Date().toLocaleDateString("id-ID")}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        logging: false,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    try {
      if (action === "preview") {
        const url = await html2pdf().from(reportContentRef.current).set(options).outputPdf("bloburl")
        setPdfPreviewUrl(url)
      } else {
        await html2pdf().from(reportContentRef.current).set(options).save()
      }
    } catch (error) {
      console.error(`Error saat ${action === "preview" ? "membuat preview" : "mengunduh"} PDF:`, error)
      alert(`Gagal ${action === "preview" ? "membuat preview" : "mengunduh"} PDF. Silakan coba lagi.`)
    } finally {
      setIsProcessing(false)
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
            <div className="flex gap-3">
              <Button
                onClick={() => generatePdf("preview")}
                disabled={isProcessing}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isProcessing ? "Memproses..." : "Preview"}
              </Button>
              <Button
                onClick={() => generatePdf("download")}
                disabled={isProcessing}
                className="green-gradient hover:opacity-90"
              >
                <Printer className="h-4 w-4 mr-2" />
                {isProcessing ? "Mencetak..." : "Download"}
              </Button>
            </div>
          </div>

          <div
            ref={reportContentRef}
            className="bg-white p-6 rounded-lg shadow-sm print:w-full print:p-0 print:shadow-none"
          >
            {(user.role === "superadmin" || user.role === "finance") && (
              <>
                <FinancialSummary />
                <LatestInvoices />
              </>
            )}

            {(user.role === "superadmin" || user.role === "admin") && (
              <>
                <OperationalSummary />
                <LatestTransactions />
              </>
            )}

            {user.role === "mitra" && (
              <>
                <MitraTransactions userId={user.id} />
                <MitraInvoices userId={user.id} />
                {mockTransactions.filter((t) => mockMitra.find((m) => m.id === t.branchId)?.id === user.id)
                  .length === 0 &&
                  mockInvoices.filter((inv) => inv.mitraId === user.id).length === 0 && (
                    <EmptyReportMessage message="Data laporan Anda akan muncul di sini setelah ada aktivitas." />
                  )}
              </>
            )}
          </div>

          {pdfPreviewUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden relative flex flex-col">
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Preview Laporan PDF</h3>
                  <Button
                    onClick={() => {
                      setPdfPreviewUrl(null)
                      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Tutup Preview
                  </Button>
                </div>
                <div className="flex-grow">
                  <iframe src={pdfPreviewUrl} className="w-full h-full border-none" title="PDF Preview" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
