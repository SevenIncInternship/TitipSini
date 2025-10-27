
"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Package, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Category } from "@/types"

export default function PricingPage() {
  const { user, loading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods/category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
          },
        })
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      } finally {
        setFetching(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user || !["superadmin", "finance"].includes(user.role)) {
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

  const handleEditCategory = async (categoryData: Partial<Category>) => {
    if (!editingCategory) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods/category/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
        },
        body: JSON.stringify({ ...editingCategory, ...categoryData }),
      })

      if (!res.ok) throw new Error("Failed to update category")

      const updated = await res.json()
      setCategories(categories.map(c => (c.id === updated.id ? updated : c)))
      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert("Gagal mengupdate tarif kategori")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tarif Harian</h1>
              <p className="text-gray-600 mt-2">Kelola tarif harian untuk setiap kategori barang.</p>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {categories.map(category => (
              <Card key={category.id} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1 mb-4 md:mb-0">
                    <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <Badge variant='default'>
                          Aktif
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 break-words">{category.description}</p>
                      <div className="text-xl font-bold text-green-600">

                        Rp {
                        //@ts-ignore
                        category.price.toLocaleString("id-ID")}/hari
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                    <Dialog open={isDialogOpen && editingCategory?.id === category.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                          onClick={() => setEditingCategory(category)}
                          disabled
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Tarif
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-gray-200">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900">Edit Tarif Kategori</DialogTitle>
                        </DialogHeader>
                        <CategoryPricingForm category={editingCategory} onSubmit={handleEditCategory} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function CategoryPricingForm({
  category,
  onSubmit,
}: {
  category: Category | null
  onSubmit: (data: Partial<Category>) => void
}) {
  const [formData, setFormData] = useState({
    price: category?.dailyRate.toString() || "", // simpan string agar bisa hapus 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ dailyRate: parseInt(formData.price) || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="price" className="text-gray-700">
          Tarif Harian (Rp)
        </Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={e => setFormData({ price: e.target.value })}
          placeholder="0"
          min="0"
          required
        />
      </div>

      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        Update Tarif
      </Button>
    </form>
  )
}
