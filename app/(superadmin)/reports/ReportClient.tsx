"use client"

import { useRef, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { FileText, Shield, Package, Users, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockDashboardStats, mockInvoices, mockTransactions, mockMitra } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import html2pdf from "html2pdf.js"

export default function ReportClient() {
  const { user, loading } = useAuth()
  const reportContentRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)

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

  const handlePrintPdf = () => {
    if (reportContentRef.current) {
      setIsPrinting(true)
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
        .finally(() => {
          setIsPrinting(false)
        })
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
            {/* Paste isi laporan di sini (dari sebelumnya) */}
          </div>
        </div>
      </main>
    </div>
  )
}