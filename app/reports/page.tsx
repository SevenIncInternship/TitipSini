"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { FileText, Shield, Package, Users, Printer, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockDashboardStats, mockInvoices, mockTransactions, mockMitra } from "@/lib/data"
import EmptyReportMessage from "./EmptyReportMessage" // assuming extracted or re-used component

const html2pdfPromise = typeof window !== "undefined" ? import("html2pdf.js") : Promise.resolve(null)
const router = useRouter()

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid": return <Badge className="bg-green-500 text-white">Lunas</Badge>
    case "pending": return <Badge className="bg-yellow-500 text-white">Pending</Badge>
    case "overdue": return <Badge variant="destructive">Jatuh Tempo</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

const getTransactionStatusBadge = (status: string) => {
  switch (status) {
    case "active": return <Badge className="bg-blue-500 text-white">Aktif</Badge>
    case "picked_up": return <Badge className="bg-green-500 text-white">Diambil</Badge>
    case "overdue": return <Badge variant="destructive">Jatuh Tempo</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const reportContentRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || !["superadmin", "admin", "finance", "mitra"].includes(user.role))) {
      router.replace("/login")
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const generatePdf = async (action: "preview" | "download") => {
    if (!reportContentRef.current) return

    setIsProcessing(true)
    const html2pdf = (await html2pdfPromise)?.default
    if (!html2pdf) return

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Laporan_Titipsini_${user?.role}_${new Date().toLocaleDateString("id-ID")}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, logging: false, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    try {
      if (action === "preview") {
        const url = await html2pdf().from(reportContentRef.current).set(options).outputPdf("bloburl")
        setPdfPreviewUrl(url)
      } else {
        await html2pdf().from(reportContentRef.current).set(options).save()
      }
    } catch (err) {
      console.error("Gagal memproses PDF", err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) return null

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
              <Button onClick={() => generatePdf("preview")} disabled={isProcessing} className="bg-blue-500 text-white">
                <Eye className="h-4 w-4 mr-2" />
                {isProcessing ? "Memproses..." : "Preview"}
              </Button>
              <Button onClick={() => generatePdf("download")} disabled={isProcessing} className="bg-green-500 text-white">
                <Printer className="h-4 w-4 mr-2" />
                {isProcessing ? "Mencetak..." : "Download"}
              </Button>
            </div>
          </div>

          <div ref={reportContentRef} className="bg-white p-6 rounded-lg shadow-sm">
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
              </>
            )}
          </div>

          {pdfPreviewUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden relative flex flex-col">
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Preview Laporan PDF</h3>
                  <Button onClick={() => {
                    setPdfPreviewUrl(null)
                    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl)
                  }} className="bg-red-500 text-white">
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