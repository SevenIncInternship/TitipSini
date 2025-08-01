"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, TrendingUp, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { tierPlans as initialTierPlans } from "@/lib/data"
import type { TierPlan } from "@/types"

export default function TiersPage() {
  const { user, loading } = useAuth() // Get loading state
  const [tierPlans, setTierPlans] = useState<TierPlan[]>(initialTierPlans)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<TierPlan | null>(null)

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

  const handleEditTier = (tierData: Partial<TierPlan>) => {
    if (editingTier) {
      setTierPlans(tierPlans.map((t) => (t.id === editingTier.id ? { ...t, ...tierData } : t)))
      setEditingTier(null)
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
              <h1 className="text-3xl font-bold text-gray-900">Jenis Kemitraan</h1>
              <p className="text-gray-600 mt-2">Kelola jenis-jenis kemitraan dan fitur yang ditawarkan.</p>
            </div>
          </div>

          {/* Tier Plans List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierPlans.map((tier) => (
              <Card key={tier.id} className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    {" "}
                    {/* Added responsiveness */}
                    <div className="flex items-center space-x-3 flex-1 mb-2 sm:mb-0">
                      {" "}
                      {/* Added responsiveness */}
                      <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 text-lg">{tier.name.toUpperCase()} Tier</CardTitle>
                        <Badge className="bg-blue-500 hover:bg-blue-600 text-xs text-white">
                          {tier.maxBranches} Cabang Maks
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-green-600">
                      Rp {tier.monthlyPrice.toLocaleString("id-ID")}/bulan
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2 mt-4 w-full">
                    {" "}
                    {/* Made button full width on small screens */}
                    <Dialog open={isDialogOpen && editingTier?.id === tier.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => setEditingTier(tier)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-gray-200">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900">Edit Tier Kemitraan</DialogTitle>
                        </DialogHeader>
                        <TierForm tier={editingTier} onSubmit={handleEditTier} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tierPlans.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada jenis kemitraan</h3>
              <p className="text-gray-500">Tambahkan jenis kemitraan pertama untuk memulai</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function TierForm({ tier, onSubmit }: { tier: TierPlan | null; onSubmit: (data: Partial<TierPlan>) => void }) {
  const [formData, setFormData] = useState({
    name: tier?.name || "bronze",
    maxBranches: tier?.maxBranches || 0,
    monthlyPrice: tier?.monthlyPrice || 0,
    features: tier?.features.join("\n") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-700">
          Nama Tier
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value as "bronze" | "silver" | "gold" })}
          className="border-gray-300 text-gray-900"
          required
          disabled // Name is usually fixed for tiers
        />
      </div>

      <div>
        <Label htmlFor="maxBranches" className="text-gray-700">
          Maksimal Cabang
        </Label>
        <Input
          id="maxBranches"
          type="number"
          value={formData.maxBranches}
          onChange={(e) => setFormData({ ...formData, maxBranches: Number.parseInt(e.target.value) || 0 })}
          className="border-gray-300 text-gray-900"
          min="0"
          required
        />
      </div>

      <div>
        <Label htmlFor="monthlyPrice" className="text-gray-700">
          Harga Bulanan (Rp)
        </Label>
        <Input
          id="monthlyPrice"
          type="number"
          value={formData.monthlyPrice}
          onChange={(e) => setFormData({ ...formData, monthlyPrice: Number.parseInt(e.target.value) || 0 })}
          className="border-gray-300 text-gray-900"
          min="0"
          required
        />
      </div>

      <div>
        <Label htmlFor="features" className="text-gray-700">
          Fitur (pisahkan dengan baris baru)
        </Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          className="border-gray-300 text-gray-900"
          rows={5}
        />
      </div>

      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        Update Tier
      </Button>
    </form>
  )
}
