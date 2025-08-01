"use client"
import { useState } from "react"
import { X, Building2, Mail, Phone, MapPin } from "lucide-react"
import { tierPlans } from "@/lib/data"
import type { Mitra } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MitraDetailModal({
  mitra,
  onClose,
  onSave
}: {
  mitra: Mitra
  onClose: () => void
  onSave: (updatedMitra: Mitra) => void
}) {
  // Buat state editable
  const [formData, setFormData] = useState<Mitra>({ ...mitra })

  const tierInfo = tierPlans.find((t) => t.name === formData.tier)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative">
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p className="text-sm text-gray-500">{formData.tier.toUpperCase()}</p>
          </div>
        </div>

        {/* Form Edit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Nama Mitra</label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm text-gray-600">No. Telepon</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm text-gray-600">Alamat</label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
            >
              <option value="active">Aktif</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Tier Paket</label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
            >
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>
          </div>

          {tierInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 font-medium mb-1">
                Paket {tierInfo.name.toUpperCase()}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                Rp {tierInfo.monthlyPrice.toLocaleString("id-ID")}/bulan
              </p>
              <p className="text-xs text-gray-600">
                Maksimal {tierInfo.maxBranches} cabang
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
