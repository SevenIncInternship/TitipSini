"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Package, User } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { label: "Home", icon: Home, path: "/customer/dashboard" },
    { label: "Titipan", icon: Package, path: "/customer/orders" },
    { label: "Profil", icon: User, path: "/customer/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-200 flex justify-around py-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-sm px-3 py-1 ${
              active ? "text-green-600 bg-green-50 rounded-lg" : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
