"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Building2, Phone, Mail, MapPin, User, CalendarDays, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Mitra, Branch } from "@/types"


export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [mitraData, setMitraData] = useState<Mitra | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false)
  const [newBranchData, setNewBranchData] = useState<Partial<Branch>>({})
  const [vendorId, setVendorId] = useState<string | null>(null)
  // Ambil data vendor & cabang dari API
  // Ambil vendor
  useEffect(() => {
    if (user && user.role === "vendor") {
      const fetchMitra = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/by-user`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("titipsini_token")}` },
          });

          if (!res.ok) throw new Error("Failed to fetch vendor data");

          const data = await res.json();
          console.log("Vendor:", data);
          setMitraData(data);
          setVendorId(data.id);
        } catch (err) {
          console.error("Failed to fetch vendor data:", err);
        }
      };
      fetchMitra();
    }
  }, [user]);

  // Ambil branch ketika vendorId sudah ada
  useEffect(() => {
    if (vendorId) {
      const fetchBranch = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}/branch`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("titipsini_token")}` },
          });

          if (!res.ok) throw new Error("Failed to fetch branch data");

          const data = await res.json();
          console.log("Branches:", data);
          setBranches(data);
        } catch (err) {
          console.error("Failed to fetch branch data:", err);
        }
      };
      fetchBranch();
    }
  }, [vendorId]);


  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user || user.role !== "vendor")
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    )

  const handleAddBranch = async () => {
    if (!mitraData) return

    try {
      // Backend menggunakan vendor.id di URL dan memerlukan Authorization header
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${mitraData.id}/branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("titipsini_token")}`
        },
        body: JSON.stringify(newBranchData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Gagal menambahkan cabang")
      }

      // Backend mengembalikan { message, branch }
      const { branch } = await res.json()
      setBranches([...branches, branch])
      setIsBranchDialogOpen(false)
      setNewBranchData({})

    } catch (err) {
      console.error("Failed to add branch:", err)
      alert(err instanceof Error ? err.message : "Gagal menambahkan cabang")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profil Mitra</h1>

        {mitraData && (
          <Card className="mb-8 bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardHeader className="flex justify-start items-start">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-lg font-semibold">{mitraData.companyName}</CardTitle>
                  <Badge className="bg-green-500 text-white text-xs mt-1">Aktif</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 mt-3">
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{mitraData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{mitraData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{mitraData.companyAddress}</span>
              </div>
            </CardContent>
          </Card>

        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cabang Anda ({branches.length})</h2>
          <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="green-gradient hover:opacity-90" onClick={() => setIsBranchDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Cabang
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Cabang Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Cabang</Label>
                  <Input
                    id="name"
                    placeholder="Nama Cabang"
                    value={newBranchData.name || ""}
                    onChange={(e) => setNewBranchData({ ...newBranchData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    placeholder="Alamat"
                    value={newBranchData.address || ""}
                    onChange={(e) => setNewBranchData({ ...newBranchData, address: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    placeholder="Telepon"
                    value={newBranchData.phone || ""}
                    onChange={(e) => setNewBranchData({ ...newBranchData, phone: e.target.value })}
                    required
                  />
                </div>
                <Button onClick={handleAddBranch} className="w-full green-gradient">
                  Tambah Cabang
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardHeader className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 green-gradient rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{branch.name}</CardTitle>
                    <Badge>Aktif</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}