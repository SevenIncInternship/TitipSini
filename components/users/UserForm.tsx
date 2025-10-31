"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InternalUser {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: "superadmin" | "vendor" | "customer"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
}

export default function UserForm({
  user,
  onSubmit,
}: {
  user: InternalUser | null
  onSubmit: (data: Partial<InternalUser> & { password?: string }) => void
}) {
  const [formData, setFormData] = useState<{
    name: string
    email: string
    phone?: string
    address?: string
    role: "superadmin" | "vendor" | "customer"
    password?: string
  }>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user?.role || "customer",
    password: "", // tetap bisa diisi
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = { ...formData }
    if (user) delete payload.password // password hanya dikirim saat create

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input
          id="phone"
          value={formData.phone || ""}
          min={10}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="address">Alamat</Label>
        <Input
          id="address"
          min={10}
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      {!user && (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: "superadmin" | "customer" | 'vendor') =>
            setFormData({ ...formData, role: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="superadmin">superadmin</SelectItem>
            <SelectItem value="customer">customer</SelectItem>
            <SelectItem value="vendor">vendor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full green-gradient hover:opacity-90">
        {user ? "Update User" : "Buat User"}
      </Button>
    </form>
  )
}