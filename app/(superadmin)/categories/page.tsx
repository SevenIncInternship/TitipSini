"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, GripVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Category } from "@/types"

export default function CategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods/category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
          },
        })
        const data = await res.json()
        setCategories(
          data.map((item: any) => ({
            id: item.id,
            name: item.title,
            dailyRate: item.price,
            description: item.description,
            order: item.id,
          }))
        )
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // ✅ Create category (POST)
  const handleCreateCategory = async (categoryData: Partial<Category>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
        },
        body: JSON.stringify({
          title: categoryData.name,
          price: categoryData.dailyRate,
          description: categoryData.description,
        }),
      })

      const result = await res.json()
      if (res.ok) {
        const newCategory: Category = {
          id: result.data.id,
          name: result.data.title,
          dailyRate: result.data.price,
          description: result.data.description,
          order: categories.length + 1,
        }
        setCategories([...categories, newCategory])
        setIsDialogOpen(false)
      } else {
        alert(result.message || "Gagal membuat kategori")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // ✅ Delete category (DELETE)
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods/category/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
        },
      })

      const result = await res.json()
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== categoryId))
      } else {
        alert(result.message || "Gagal menghapus kategori")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // ✅ Local edit (belum ada endpoint PUT di backend)
  const handleEditCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c)))
      setEditingCategory(null)
      setIsDialogOpen(false)
    }
  }

  // const handleToggleActive = (categoryId: string) => {
  //   setCategories(categories.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c)))
  // }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  if (!user || !["superadmin"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kategori Barang</h1>
              <p className="text-gray-600 mt-2">Kelola kategori penitipan barang</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="green-gradient hover:opacity-90 mt-4 sm:mt-0"
                  onClick={() => setEditingCategory(null)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                  </DialogTitle>
                </DialogHeader>
                <CategoryForm
                  category={editingCategory}
                  onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Categories List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Memuat data kategori...</div>
          ) : sortedCategories.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada kategori</h3>
              <p className="text-gray-500">Tambahkan kategori pertama untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map((category) => (
                <Card key={category.id} className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1 mb-4 md:mb-0">
                        <GripVertical className="h-5 w-5 text-gray-400 hidden sm:block" />
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
                            Rp {category.dailyRate.toLocaleString("id-ID")}/hari
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`active-${category.id}`}
                          checked={true}
                        // onCheckedChange={() => handleToggleActive(category.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => {
                            setEditingCategory(category)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function CategoryForm({
  category,
  onSubmit,
}: {
  category: Category | null
  onSubmit: (data: Partial<Category>) => void
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    dailyRate: category?.dailyRate || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-700">
          Nama Kategori
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-gray-300 text-gray-900"
          placeholder="Contoh: Kecil, Sedang, Besar"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-700">
          Deskripsi
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border-gray-300 text-gray-900"
          placeholder="Deskripsi kategori barang..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="dailyRate" className="text-gray-700">
          Tarif Harian (Rp)
        </Label>
        <Input
          id="dailyRate"
          type="number"
          value={formData.dailyRate ?? ""} // jika null, tampilkan string kosong
          onChange={(e) =>
            setFormData({
              ...formData,
              // @ts-ignore
              dailyRate: e.target.value === "" ? null : parseInt(e.target.value),
            })
          }
          className="border-gray-300 text-gray-900"
          placeholder="0"
          min="0"
          required
        />

      </div>

      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        {category ? "Update Kategori" : "Buat Kategori"}
      </Button>
    </form>
  )
}
