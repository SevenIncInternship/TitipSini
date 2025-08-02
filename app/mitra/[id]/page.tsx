import Link from "next/link"
import { Building2, Mail, Phone, MapPin, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockMitra, tierPlans } from "@/lib/data"

export default function MitraDetailPage({ params }: { params: { id: string } }) {
  const mitra = mockMitra.find((m) => m.id === params.id)

  if (!mitra) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mitra Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-4">Pastikan ID yang dimasukkan benar.</p>
        <Link href="/mitra">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke List
          </Button>
        </Link>
      </div>
    )
  }

  const tierInfo = tierPlans.find((t) => t.name === mitra.tier)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Detail Mitra</h1>
          <Link href="/mitra">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
            </Button>
          </Link>
        </div>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between border-b">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 green-gradient rounded-lg flex items-center justify-center">
                <Building2 className="text-white h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">{mitra.name}</CardTitle>
                <div className="flex space-x-2 mt-1">
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                    {mitra.tier.toUpperCase()}
                  </Badge>
                  {mitra.status === "active" && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Aktif</Badge>
                  )}
                  {mitra.status === "suspended" && (
                    <Badge variant="destructive" className="text-xs">Suspended</Badge>
                  )}
                  {mitra.status === "pending_payment" && (
                    <Badge className="bg-yellow-500 text-white text-xs">Pending Payment</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-6 space-y-4 text-sm text-gray-700">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span>{mitra.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{mitra.phone}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
              <span>{mitra.address}</span>
            </div>

            {tierInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-green-700 mb-1">
                  Paket {tierInfo.name.toUpperCase()}
                </p>
                <p className="text-gray-900 font-bold">
                  Rp {tierInfo.monthlyPrice.toLocaleString("id-ID")}/bulan
                </p>
                <p className="text-xs text-gray-600">Maksimal {tierInfo.maxBranches} cabang</p>
              </div>
            )}

            <p className="text-xs text-gray-500 pt-4">
              Bergabung sejak: {mitra.createdAt.toLocaleDateString("id-ID")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
