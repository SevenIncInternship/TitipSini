"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "superadmin@titipsini.com",
    name: "Super Admin",
    role: "superadmin",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "admin@titipsini.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "3",
    email: "finance@titipsini.com",
    name: "Finance User",
    role: "finance",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "4", // Matching mitra user ID with mockMitra
    email: "mitra@example.com",
    name: "Mitra Example",
    role: "mitra",
    status: "active",
    createdAt: new Date(),
  },
]

import { useRouter } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter() // ← Tambahkan ini

  useEffect(() => {
    const storedUser = localStorage.getItem("titipsini_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("titipsini_user", JSON.stringify(foundUser))
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("titipsini_user")
    router.replace("/login") // ← Redirect ke halaman login setelah logout
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
