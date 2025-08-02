"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect ke dashboard sesuai role
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  // Sementara loading, kosongkan biar nggak flicker
  if (loading || user) return null


