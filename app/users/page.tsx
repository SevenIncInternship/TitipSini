"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar" // Updated import
import { Header } from "@/components/layout/header" // Updated import
import { useAuth } from "@/lib/auth" // Updated import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Shield, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InternalUser {
  id: string
  name: string
  email: string
  role: "admin" | "finance"
  status: "active" | "inactive"
  createdAt: Date
  lastLogin?: Date
}

const mockUsers: InternalUser[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@titipsini.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-01-29"),
  },
  {
    id: "2",
    name: "Finance User",
    email: "finance@titipsini.com",
    role: "finance",
    status: "active",
    createdAt: new Date("2024-01-20"),
    lastLogin: new Date("2024-01-28"),
  },
]

export default function UsersPage() {
  const { user, loading } = useAuth() // Get loading state
  const [users, setUsers] = useState<InternalUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null)

  // Handle loading state first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (user?.role !== "superadmin") {
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateUser = (userData: Partial<InternalUser>) => {
    const newUser: InternalUser = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "admin",
      status: "active",
      createdAt: new Date(),
    }
    setUsers([...users, newUser])
    setIsDialogOpen(false)
  }

  const handleEditUser = (userData: Partial<InternalUser>) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u)))
      setEditingUser(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen User Internal</h1>
              <p className="text-gray-600 mt-2">Kelola akun Admin dan Finance</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="green-gradient hover:opacity-90" onClick={() => setEditingUser(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">{editingUser ? "Edit User" : "Tambah User Baru"}</DialogTitle>
                </DialogHeader>
                <UserForm user={editingUser} onSubmit={editingUser ? handleEditUser : handleCreateUser} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => (
              <Card key={u.id} className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 green-gradient rounded-full flex items-center justify-center">
                        {u.role === "admin" ? (
                          <Shield className="h-5 w-5 text-white" />
                        ) : (
                          <DollarSign className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 text-sm">{u.name}</CardTitle>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                          {u.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={u.status === "active" ? "default" : "destructive"}>{u.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">{u.email}</p>
                    <p className="text-gray-500">Dibuat: {u.createdAt.toLocaleDateString("id-ID")}</p>
                    {u.lastLogin && (
                      <p className="text-gray-500">Login terakhir: {u.lastLogin.toLocaleDateString("id-ID")}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      onClick={() => {
                        setEditingUser(u)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
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

function UserForm({
  user,
  onSubmit,
}: {
  user: InternalUser | null
  onSubmit: (data: Partial<InternalUser>) => void
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || ("admin" as "admin" | "finance"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-gray-700">
          Nama
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
        <Label htmlFor="role" className="text-gray-700">
          Role
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value: "admin" | "finance") => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger className="border-gray-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        {user ? "Update User" : "Buat User"}
      </Button>
    </form>
  )
}
