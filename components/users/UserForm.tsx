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
  role: "admin" | "finance"
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
  role: "admin" | "finance"
  password?: string // ubah ini jadi opsional
}>({
  name: user?.name || "",
  email: user?.email || "",
  role: user?.role || "admin",
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
          onValueChange={(value: "admin" | "finance") =>
            setFormData({ ...formData, role: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
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