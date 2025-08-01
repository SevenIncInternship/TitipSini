"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar" // Updated import
import { Header } from "@/components/layout/header" // Updated import
import { useAuth } from "@/lib/auth" // Updated import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, GripVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { categories as initialCategories } from "@/lib/data" // Updated import
import type { Category } from "@/types" // Updated import

export default function CategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  if (!user || !["superadmin", "admin"].includes(user.role)) {
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

  const handleCreateCategory = (categoryData: Partial<Category>) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryData.name || "",
      dailyRate: categoryData.dailyRate || 0,
      description: categoryData.description || "",
      isActive: true,
      order: categories.length + 1,
    }
    setCategories([...categories, newCategory])
    setIsDialogOpen(false)
  }

  const handleEditCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c)))
      setEditingCategory(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId))
  }

  const handleToggleActive = (categoryId: string) => {
    setCategories(categories.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c)))
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
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
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <Card key={category.id} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    {" "}
                    {/* Added responsiveness */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1 mb-4 md:mb-0">
                      {" "}
                      {/* Added responsiveness */}
                      <div className="cursor-move hidden sm:block">
                        {" "}
                        {/* Hide on very small screens */}
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {" "}
                        {/* Ensure content can shrink */}
                        <div className="flex flex-wrap items-center space-x-3 mb-2">
                          {" "}
                          {/* Added flex-wrap */}
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 break-words">{category.description}</p>{" "}
                        {/* Added break-words */}
                        <div className="text-xl font-bold text-green-600">
                          Rp {category.dailyRate.toLocaleString("id-ID")}/hari
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                      {" "}
                      {/* Added responsiveness */}
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`active-${category.id}`} className="text-gray-700 text-sm">
                          Aktif
                        </Label>
                        <Switch
                          id={`active-${category.id}`}
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleActive(category.id)}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent w-full sm:w-auto"
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
                        className="w-full sm:w-auto"
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

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada kategori</h3>
              <p className="text-gray-500">Tambahkan kategori pertama untuk memulai</p>
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
          value={formData.dailyRate}
          onChange={(e) => setFormData({ ...formData, dailyRate: Number.parseInt(e.target.value) || 0 })}
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
