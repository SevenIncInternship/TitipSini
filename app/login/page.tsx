"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  // const { user, loading } = useAuth()
  // const router = useRouter()

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("titipsini_user")
  //   const storedToken = localStorage.getItem("titipsini_token")

  //   // Jika sudah login, langsung ke dashboard
  //   if (!loading && (user || (storedUser && storedToken))) {
  //     router.replace("/dashboard")
  //   }
  // }, [user, loading, router])

  // // Sembunyikan tampilan selama loading untuk mencegah flicker
  // if (loading || user) return null

  return (
    <div className="flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
