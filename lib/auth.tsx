"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("titipsini_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // 🔐 Login pakai API backend Fastify
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        // Jika status bukan 200, anggap login gagal
        setLoading(false)
        return false
      }

      const data = await res.json()

      // Pastikan response API ada data user & token
      if (data?.user && data?.token) {
        // Simpan user dan token ke localStorage
        localStorage.setItem("titipsini_user", JSON.stringify(data.user))
        localStorage.setItem("titipsini_token", data.token)

        setUser(data.user)
        setLoading(false)
        return true
      }

      setLoading(false)
      return false
    } catch (err) {
      console.error("Login failed:", err)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("titipsini_user")
    localStorage.removeItem("titipsini_token")

    router.replace("/login") // Redirect ke login
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
