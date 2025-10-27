'use client'

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import Navbar from "@/components/customers/navbar"
import { User, MapPin, Lock, HelpCircle, Info, LogOut, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { logout } = useAuth()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("titipsini_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p>Memuat profil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => history.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Profil</h1>
        <div className="w-6" />
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
        <Image
          src="https://api.dicebear.com/8.x/avataaars/svg?seed=user"
          alt="Avatar"
          width={60}
          height={60}
          className="rounded-full border"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg flex items-center gap-1">
            {user.name}{" "}
            <CheckCircle className="text-green-500 w-4 h-4" />
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          ✎
        </button>
      </div>

      {/* Menu Sections */}
      <div className="max-w-md mx-auto mt-4 space-y-4 px-4">
        <div className="bg-white rounded-xl shadow-sm divide-y">
          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="text-green-600 w-5 h-5" />
              <span>Alamat</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        <div className="text-gray-500 text-sm font-semibold px-2 mt-2">
          Pengaturan & Preferensi
        </div>
        <div className="bg-white rounded-xl shadow-sm divide-y">
          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3 text-gray-700">
              <Lock className="text-green-600 w-5 h-5" />
              <span>Keamanan</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        <div className="text-gray-500 text-sm font-semibold px-2 mt-2">
          Bantuan
        </div>
        <div className="bg-white rounded-xl shadow-sm divide-y">
          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3 text-gray-700">
              <HelpCircle className="text-green-600 w-5 h-5" />
              <span>Pusat Bantuan</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3 text-gray-700">
              <Info className="text-green-600 w-5 h-5" />
              <span>Tentang</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3 text-red-600">
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  )
}
