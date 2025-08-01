"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X,
  UserCheck,
  MapPin,
  TrendingUp,
  Bell,
  DollarSign,
  Shield,
  Globe,
} from "lucide-react"
import { SidebarContent } from "@/components/ui/sidebar"

const navigationItems = {
  superadmin: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen User", href: "/users", icon: Users },
    { name: "Verifikasi Mitra", href: "/mitra/verification", icon: UserCheck },
    { name: "List Mitra", href: "/mitra", icon: Building2 },
    { name: "Verifikasi Cabang", href: "/branches/verification", icon: MapPin },
    { name: "Kategori Barang", href: "/categories", icon: Package },
    { name: "Tarif Harian", href: "/pricing", icon: DollarSign },
    { name: "Jenis Kemitraan", href: "/tiers", icon: TrendingUp },
    { name: "Invoice & Pembayaran", href: "/invoices", icon: CreditCard },
    { name: "Laporan", href: "/reports", icon: FileText },
    { name: "Landing Page", href: "/content", icon: Globe },
    { name: "Pengingat", href: "/reminders", icon: Bell },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Verifikasi Mitra", href: "/mitra/verification", icon: UserCheck },
    { name: "List Mitra", href: "/mitra", icon: Building2 },
    { name: "Verifikasi Cabang", href: "/branches/verification", icon: MapPin },
    { name: "Kategori Barang", href: "/categories", icon: Package },
    { name: "Laporan Operasional", href: "/reports", icon: FileText },
    { name: "Landing Page", href: "/content", icon: Globe },
  ],
  finance: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "List Mitra", href: "/mitra", icon: Building2 },
    { name: "Tarif Harian", href: "/pricing", icon: DollarSign },
    { name: "Jenis Kemitraan", href: "/tiers", icon: TrendingUp },
    { name: "Invoice & Pembayaran", href: "/invoices", icon: CreditCard },
    { name: "Laporan Keuangan", href: "/reports", icon: FileText },
    { name: "Pengingat", href: "/reminders", icon: Bell },
  ],
  mitra: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profil & Cabang", href: "/profile", icon: Building2 },
    { name: "Transaksi", href: "/transactions", icon: Package },
    { name: "Invoice", href: "/invoices", icon: CreditCard },
    { name: "Laporan", href: "/reports", icon: FileText },
  ],
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = navigationItems[user.role] || []

  return (
    <>
      {/* Tombol menu di mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Image
                src="/logotitipsini.png"
                alt="Titipsini"
                width={32}
                height={32}
                className="rounded-md"
              />
              <h1 className="text-xl font-bold text-green-600">Titipsini</h1>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 green-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-green-600 capitalize font-medium">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <SidebarContent className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "green-gradient text-white shadow-md"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </SidebarContent>

          {/* Tombol Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
