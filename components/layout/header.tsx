"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth" // Updated import

export function Header() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 md:ml-64 shadow-sm">
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-full md:w-auto">
          {" "}
          {/* Make search container full width on small screens */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari mitra, cabang, atau transaksi..."
              className="pl-10 w-full md:w-96 border-gray-300 focus:border-green-500 focus:ring-green-500" // Adjust width for responsiveness
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-green-600 hover:bg-green-50">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 green-gradient rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-gray-700 hidden md:block font-medium">{user.name}</span>
        </div>
      </div>
    </header>
  )
}
