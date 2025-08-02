"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Globe, Shield } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ContentPage() {
  const { user, loading } = useAuth()

  const [headline, setHeadline] = useState("Titipsini - Solusi Penitipan Barang Modern")
  const [subheadline, setSubheadline] = useState("Aman. Terjangkau. Terpercaya.")
  const [description, setDescription] = useState(
    "Titipsini adalah platform untuk menitipkan barang secara mudah dan cepat ke mitra terpercaya di seluruh Indonesia."
  )
  const [bannerUrl, setBannerUrl] = useState("https://via.placeholder.com/600x300.png?text=Banner+Landing+Page")
  const [hasImageError, setHasImageError] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !["superadmin", "admin"].includes(user.role)) {
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

  const handleSave = () => {
    console.log({ headline, subheadline, description, bannerUrl })
    alert("Konten berhasil disimpan (dummy)")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Landing Page</h1>
            <p className="text-gray-600 mt-2">Kelola konten untuk landing page Titipsini.</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Headline</label>
                <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subheadline</label>
                <Input value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Banner URL</label>
                <Input
                  value={bannerUrl}
                  onChange={(e) => {
                    setBannerUrl(e.target.value)
                    setHasImageError(false)
                  }}
                />
                <img
                  src={hasImageError ? "https://via.placeholder.com/600x300.png?text=Invalid+URL" : bannerUrl}
                  alt="Banner Preview"
                  className="rounded-lg border mt-2 w-full max-h-64 object-cover"
                  onError={() => setHasImageError(true)}
                  onLoad={() => setHasImageError(false)}
                />
              </div>
              <div className="text-right">
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
