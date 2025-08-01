"use client"

import type React from "react"
<<<<<<< HEAD

import { useState } from "react"
=======
import { useState } from "react"
import Image from "next/image"
>>>>>>> master
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
<<<<<<< HEAD
import { useAuth } from "@/lib/auth" // Updated import
=======
import { useAuth } from "@/lib/auth"
>>>>>>> master
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Email atau password salah")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
<<<<<<< HEAD
          <div className="mx-auto w-12 h-12 green-gradient rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">T</span>
=======
          {/* LOGO GANTI DI SINI */}
          <div className="mx-auto mb-4">
            <Image
              src="/logotitipsini.png"
              alt="Titipsini Logo"
              width={80}
              height={80}
              className="mx-auto"
              priority
            />
>>>>>>> master
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Titipsini</CardTitle>
          <CardDescription>Masuk ke dashboard admin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@titipsini.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full green-gradient hover:opacity-90" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600 mb-2">Demo Accounts:</div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Superadmin: superadmin@titipsini.com</div>
              <div>Admin: admin@titipsini.com</div>
              <div>Finance: finance@titipsini.com</div>
              <div>Mitra: mitra@example.com</div>
              <div className="font-medium">Password: password123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
