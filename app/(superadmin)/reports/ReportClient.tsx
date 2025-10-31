"use client"

import { useEffect, useRef, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Shield, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import html2pdf from "html2pdf.js"

interface GoodsItem {
  id: string
  name: string
  quantity: number
  dateIn: string
  dateOut: string
  dayTotal: number
  totalPrice: number
  paymentMethod: string
  bank?: string | null
  status: boolean
  createdAt: string
  vendorBranch?: {
    id: string
    name: string
    address?: string
  }
}

export default function ReportClient() {
  const { user, loading } = useAuth()
  const reportContentRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [loadingGoods, setLoadingGoods] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data barang dari API
  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`, // jika pakai JWT
          },
        })
        if (!res.ok) throw new Error("Gagal memuat data barang")
        const result = await res.json()
        console.log("Data barang:", result)
        setGoods(result.data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoadingGoods(false)
      }
    }

    fetchGoods()
  }, [])

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

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">Aktif</Badge>
    ) : (
      <Badge variant="destructive">Tidak Aktif</Badge>
    )
  }

  const handlePrintPdf = () => {
    if (reportContentRef.current) {
      setIsPrinting(true)
      html2pdf()
        .from(reportContentRef.current)
        .set({
          margin: 0.5,
          filename: `Laporan_Goods_${user.role}_${new Date().toLocaleDateString("id-ID")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .save()
        .finally(() => {
          setIsPrinting(false)
        })
    }
  }

  return (
    <div className="min-h-screen ">


      <main className="">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan Barang</h1>
              <p className="text-gray-600 mt-2">Laporan data barang dari sistem Titipsini.</p>
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
            {loadingGoods ? (
              <div className="text-center py-10 text-gray-600">Memuat data barang...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : goods.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Belum ada data barang.</div>
            ) : (
              <div className="grid gap-4">
                {goods.map((item) => (
                  <Card key={item.id} className="border border-gray-200 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Cabang: {item.vendorBranch?.name || "N/A"} | Masuk:{" "}
                        {new Date(item.dateIn).toLocaleDateString("id-ID")}
                      </p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Jumlah</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Durasi (hari)</p>
                        <p className="font-medium">{item.dayTotal}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Harga</p>
                        <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        {getStatusBadge(item.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
