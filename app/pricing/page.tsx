"use client"

import type React from "react"
import { Shield } from "lucide-react" // Import Shield component

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Package } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { categories as initialCategories } from "@/lib/data"
import type { Category } from "@/types"

export default function PricingPage() {
  const { user, loading } = useAuth() // Get loading state
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Handle loading state first
  if (loading) {
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

  const handleEditCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c)))
      setEditingCategory(null)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            {" "}
            {/* Added responsiveness */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tarif Harian</h1>
              <p className="text-gray-600 mt-2">Kelola tarif harian untuk setiap kategori barang.</p>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    {" "}
                    {/* Added responsiveness */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1 mb-4 md:mb-0">
                      {" "}
                      {/* Added responsiveness */}
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
                    <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                      {" "}
                      {/* Added responsiveness */}
                      <Dialog open={isDialogOpen && editingCategory?.id === category.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent w-full sm:w-auto"
                            onClick={() => setEditingCategory(category)}
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

function CategoryPricingForm({
  category,
  onSubmit,
}: {
  category: Category | null
  onSubmit: (data: Partial<Category>) => void
}) {
  const [formData, setFormData] = useState({
    dailyRate: category?.dailyRate || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        Update Tarif
      </Button>
    </form>
  )
}
