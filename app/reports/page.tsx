"use client"

import dynamic from "next/dynamic"

// Lazy load client component with SSR disabled (hanya bisa di client component)
const ReportClient = dynamic(() => import("./ReportClient"), { ssr: false })

export default function ReportsPage() {
  return <ReportClient />
}