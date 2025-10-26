"use client"

import { useAuth } from "@/lib/auth" // Updated import
import { LoginForm } from "@/components/auth/login-form" // Updated import
import { Sidebar } from "@/components/layout/sidebar" // Updated import
import { Header } from "@/components/layout/header" // Updated import
import { StatsCard } from "@/components/dashboard/stats-card" // Updated import
import { mockDashboardStats } from "@/lib/data" // Updated import
import { Users, Building2, Package, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {

  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("titipsini_user")
    const storedToken = localStorage.getItem("titipsini_token")

    // jika tidak ada user atau token -> redirect ke login
    if (!storedUser || !storedToken) {
      router.push("/login")
    }
  }, [router])

  
}
