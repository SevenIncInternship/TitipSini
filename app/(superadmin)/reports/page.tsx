"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Eye, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import html2pdf from "html2pdf.js"
import ReportClient from "./ReportClient"

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const reportContentRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  // 🔒 Redirect ke login jika bukan role yang diizinkan
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
        const pdfBlob = await html2pdf().from(reportContentRef.current).set(options).outputPdf("bloburl")
        setPdfPreviewUrl(pdfBlob)
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
    <div className="min-h-screen ">
      <Sidebar />
      <Header />

      <main className="md:ml-64  p-6">
        <div className="max-w-7xl mx-auto">
          {/* <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
              <p className="text-gray-600 mt-2">Lihat dan cetak laporan barang.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => generatePdf("preview")}
                disabled={isProcessing}
                className="bg-blue-500 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isProcessing ? "Memproses..." : "Preview"}
              </Button>
              <Button
                onClick={() => generatePdf("download")}
                disabled={isProcessing}
                className="bg-green-500 text-white"
              >
                <Printer className="h-4 w-4 mr-2" />
                {isProcessing ? "Mencetak..." : "Download"}
              </Button>
            </div>
          </div> */}

          {/* ✅ Report content yang diambil dari komponen ReportClient */}
          <div ref={reportContentRef} className="bg-white p-6 rounded-lg shadow-sm">
            <ReportClient /> {/* Menampilkan daftar goods dari API */}
          </div>

          {/* ✅ Preview Modal */}
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
                    className="bg-red-500 text-white"
                  >
                    Tutup Preview
                  </Button>
                </div>
                <div className="flex-grow">
                  <iframe
                    src={pdfPreviewUrl}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
