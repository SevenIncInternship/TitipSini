"use client"
import { useEffect, useState } from "react"

interface User {
  id: string
  name: string
  address: string
  role: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("titipsini_user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  return (
    <header className="p-4 flex items-center justify-between border-b border-gray-200">
      <div>
        <p className="text-lg font-semibold">Hello 👋</p>
        <p className="text-gray-700 font-medium">{user?.name || "User"}</p>
        <p className="text-sm text-gray-500">{user?.address || "-"}</p>
      </div>
      <div className="flex flex-col items-end">
        <div className="rounded-full bg-gray-200 p-3 w-12 h-12 text-center">
          <span className="text-gray-600 text-lg font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <span className="text-xs text-green-500 mt-1 bg-green-100 px-2 py-1 rounded">
          Verified
        </span>
      </div>
    </header>
  )
}
