  "use client"

  import { useAuth } from "@/lib/auth"
  import { Sidebar } from "@/components/layout/sidebar"
  import { Header } from "@/components/layout/header"
  import { StatsCard } from "@/components/dashboard/stats-card"
  import { Users, Building2, Package, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  import { useEffect, useState } from "react"

  export default function DashboardPage() {
    const { user, loading } = useAuth()
    const [stats, setStats] = useState<any | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)

    // Fetch data dashboard dari API
    useEffect(() => {
  if (!user || loading) return // Tunggu sampai user tersedia

  async function fetchStats() {
    try {
      const res = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // atau ambil dari context
        },
      })

      if (!res.ok) throw new Error("Gagal mengambil data")

      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  fetchStats()
}, [user, loading]) // <- tunggu sampai user siap


    // Handle loading state
    if (loading || loadingStats) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )
    }

    if (!user || !stats) return null

    const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

  const formatPercentage = (num: number, denom: number) => {
  if (!denom || denom === 0) return "0% dari total"
  return `${Math.round((num / denom) * 100)}% dari total`
}

    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Header />

        <main className="md:ml-64 pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Selamat datang kembali, {user.name}</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Mitra"
                value={stats.totalMitra}
                change={`${stats.mitraAktif} aktif`}
                changeType="positive"
                icon={Users}
              />
              <StatsCard
                title="Total Cabang"
                value={stats.totalCabang}
                change={`+${stats.newBranches24h || 0} hari ini`}
                changeType="positive"
                icon={Building2}
              />
              <StatsCard
                title="Transaksi Harian"
                value={stats.transaksiHarian}
                change="+12% dari kemarin"
                changeType="positive"
                icon={Package}
              />
              <StatsCard
                title="Pendapatan Bulanan"
                value={formatCurrency(stats.pendapatanBulanan)}
                change="+8% dari bulan lalu"
                changeType="positive"
                icon={DollarSign}
              />
            </div>

            {/* Finance Stats for Finance/Superadmin */}
            {(user.role === "finance" || user.role === "superadmin") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Invoice Bulan Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.invoiceBulanIni)}</div>
                    <p className="text-xs opacity-90 mt-1">Total tagihan</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium opacity-90">Sudah Dibayar</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{formatCurrency(stats.sudahDibayar)}</div>
    <p className="text-xs opacity-90 mt-1">
      {formatPercentage(stats.sudahDibayar, stats.invoiceBulanIni)}
    </p>
  </CardContent>
</Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Outstanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.outstanding)}</div>
                    <p className="text-xs opacity-90 mt-1">Belum dibayar</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Mitra Aktif</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.mitraAktif}</div>
                  <Progress value={(stats.mitraAktif / stats.totalMitra) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Mitra Suspended</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.mitraSuspended}</div>
                  <Progress value={(stats.mitraSuspended / stats.totalMitra) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Verifikasi</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.mitraPending}</div>
                  <Progress value={(stats.mitraPending / stats.totalMitra) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Tren Mingguan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    +{stats.trenMingguan || 0}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Dari minggu lalu</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Categories */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Kategori Terpopuler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.kategoriTerpopuler?.map((category: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(category.count / Math.max(...stats.kategoriTerpopuler.map((c: any) => c.count))) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trend */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Tren Transaksi 7 Hari</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.weeklyTrend?.map((value: number, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Hari {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(value / Math.max(...stats.weeklyTrend)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right text-gray-700">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }
