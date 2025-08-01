"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useState, useEffect } from "react" // Import useEffect
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Building2, Phone, Mail, MapPin, User, CalendarDays } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { mockMitra, mockBranches, tierPlans } from "@/lib/data"
import type { Mitra, Branch } from "@/types"
import { Shield } from "lucide-react"

export default function ProfilePage(): ReactElement {
  const { user, loading } = useAuth() // Get loading state
  const [mitraData, setMitraData] = useState<Mitra | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  // Use useEffect to update mitraData and branches when user changes
  useEffect(() => {
    if (user && user.role === "mitra") {
      const currentMitra = mockMitra.find((m) => m.id === user.id) // Assuming user.id matches mitra.id
      setMitraData(currentMitra || null)
      setBranches(mockBranches.filter((b) => b.mitraId === user.id))
    }
  }, [user]) // Dependency array includes user

  // Handle loading state first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Now that loading is false, check user and role
  if (!user || user.role !== "mitra") {
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

  const handleEditProfile = (data: Partial<Mitra>) => {
    if (mitraData) {
      setMitraData({ ...mitraData, ...data })
      setIsProfileDialogOpen(false)
    }
  }

  const handleAddBranch = (data: Partial<Branch>) => {
    if (mitraData) {
      const newBranch: Branch = {
        id: Date.now().toString(),
        mitraId: mitraData.id,
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        status: "pending", // New branches are pending by default
        createdAt: new Date(),
      }
      setBranches([...branches, newBranch])
      setIsBranchDialogOpen(false)
    }
  }

  const handleEditBranch = (data: Partial<Branch>) => {
    if (editingBranch) {
      setBranches(branches.map((b) => (b.id === editingBranch.id ? { ...b, ...data } : b)))
      setEditingBranch(null)
      setIsBranchDialogOpen(false)
    }
  }

  const getTierInfo = (tierName: string) => {
    return tierPlans.find((t) => t.name === tierName)
  }

  const getBranchStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Aktif</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMitraStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Aktif</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "pending_payment":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending Payment</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // This check should come after user and loading checks
  if (!mitraData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const tierInfo = getTierInfo(mitraData.tier)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profil Mitra</h1>
            <p className="text-gray-600 mt-2">Kelola informasi profil dan cabang Anda.</p>
          </div>

          {/* Profile Card */}
          <Card className="bg-white border border-gray-200 shadow-sm mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 text-lg">{mitraData.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-xs text-white">
                        {mitraData.tier.toUpperCase()}
                      </Badge>
                      {getMitraStatusBadge(mitraData.status)}
                    </div>
                  </div>
                </div>
                <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Profil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Edit Profil Mitra</DialogTitle>
                    </DialogHeader>
                    <MitraProfileForm mitra={mitraData} onSubmit={handleEditProfile} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{mitraData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{mitraData.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>{mitraData.address}</span>
                </div>
                {tierInfo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <div className="text-xs text-green-600 mb-1 font-medium">Paket {tierInfo.name.toUpperCase()}</div>
                    <div className="text-sm text-gray-900 font-semibold">
                      Rp {tierInfo.monthlyPrice.toLocaleString("id-ID")}/bulan
                    </div>
                    <div className="text-xs text-gray-600">Maksimal {tierInfo.maxBranches} cabang</div>
                  </div>
                )}
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>Bergabung: {mitraData.createdAt.toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branches Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Cabang Anda ({branches.length})</h2>
            <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="green-gradient hover:opacity-90"
                  onClick={() => {
                    setEditingBranch(null)
                    setIsBranchDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Cabang
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    {editingBranch ? "Edit Cabang" : "Tambah Cabang Baru"}
                  </DialogTitle>
                </DialogHeader>
                <BranchForm branch={editingBranch} onSubmit={editingBranch ? handleEditBranch : handleAddBranch} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <Card key={branch.id} className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 green-gradient rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 text-base">{branch.name}</CardTitle>
                        {getBranchStatusBadge(branch.status)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      onClick={() => {
                        setEditingBranch(branch)
                        setIsBranchDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <CalendarDays className="h-3 w-3" />
                      <span>Dibuat: {branch.createdAt.toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {branches.length === 0 && (
            <div className="text-center py-12 bg-white border border-gray-200 shadow-sm rounded-lg">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada cabang terdaftar</h3>
              <p className="text-gray-500">Tambahkan cabang pertama Anda untuk memulai.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function MitraProfileForm({
  mitra,
  onSubmit,
}: {
  mitra: Mitra | null
  onSubmit: (data: Partial<Mitra>) => void
}) {
  const [formData, setFormData] = useState({
    name: mitra?.name || "",
    email: mitra?.email || "",
    phone: mitra?.phone || "",
    address: mitra?.address || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-700">
          Nama Mitra
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <div>
        <Label htmlFor="phone" className="text-gray-700">
          Telepon
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <div>
        <Label htmlFor="address" className="text-gray-700">
          Alamat
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        Update Profil
      </Button>
    </form>
  )
}

function BranchForm({
  branch,
  onSubmit,
}: {
  branch: Branch | null
  onSubmit: (data: Partial<Branch>) => void
}) {
  const [formData, setFormData] = useState({
    name: branch?.name || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    latitude: branch?.latitude || 0,
    longitude: branch?.longitude || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="branch-name" className="text-gray-700">
          Nama Cabang
        </Label>
        <Input
          id="branch-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <div>
        <Label htmlFor="branch-address" className="text-gray-700">
          Alamat Cabang
        </Label>
        <Input
          id="branch-address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <div>
        <Label htmlFor="branch-phone" className="text-gray-700">
          Telepon Cabang
        </Label>
        <Input
          id="branch-phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border-gray-300 text-gray-900"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="branch-latitude" className="text-gray-700">
            Latitude
          </Label>
          <Input
            id="branch-latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: Number.parseFloat(e.target.value) || 0 })}
            className="border-gray-300 text-gray-900"
            required
          />
        </div>
        <div>
          <Label htmlFor="branch-longitude" className="text-gray-700">
            Longitude
          </Label>
          <Input
            id="branch-longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: Number.parseFloat(e.target.value) || 0 })}
            className="border-gray-300 text-gray-900"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        {branch ? "Update Cabang" : "Tambah Cabang"}
      </Button>
    </form>
  )
}
