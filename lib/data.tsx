import type { Mitra, Branch, Category, TierPlan, Transaction, Invoice, DashboardStats } from "@/types" // Updated import

// Mock data
export const tierPlans: TierPlan[] = [
  {
    id: "1",
    name: "bronze",
    maxBranches: 1,
    monthlyPrice: 1000,
    features: ["1 Cabang", "Dashboard Dasar", "Support Email"],
  },
  {
    id: "2",
    name: "silver",
    maxBranches: 3,
    monthlyPrice: 2000,
    features: ["3 Cabang", "Dashboard Lengkap", "Support WhatsApp", "Laporan Bulanan"],
  },
  {
    id: "3",
    name: "gold",
    maxBranches: 5,
    monthlyPrice: 3000,
    features: ["5 Cabang", "Dashboard Premium", "Priority Support", "Laporan Real-time", "API Access"],
  },
]

export const categories: Category[] = [
  { id: "1", name: "Kecil", dailyRate: 2000, description: "Barang kecil (tas, sepatu, dll)", isActive: true, order: 1 },
  { id: "2", name: "Sedang", dailyRate: 5000, description: "Barang sedang (koper, kotak)", isActive: true, order: 2 },
  { id: "3", name: "Besar", dailyRate: 10000, description: "Barang besar (furniture kecil)", isActive: true, order: 3 },
  { id: "4", name: "Kendaraan", dailyRate: 15000, description: "Motor, sepeda", isActive: true, order: 4 },
]

export const mockMitra: Mitra[] = [
  {
    id: "1",
    name: "Toko Sari Jaya",
    email: "sari@example.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 123, Jakarta",
    tier: "gold",
    status: "active",
    branches: [],
    invoices: [],
    createdAt: new Date("2024-01-15"),
    verifiedAt: new Date("2024-01-16"),
  },
  {
    id: "2",
    name: "Warung Bu Ina",
    email: "ina@example.com",
    phone: "081234567891",
    address: "Jl. Thamrin No. 456, Jakarta",
    tier: "silver",
    status: "pending_payment",
    branches: [],
    invoices: [],
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Kios Pak Budi",
    email: "budi@example.com",
    phone: "081234567892",
    address: "Jl. Gatot Subroto No. 789, Jakarta",
    tier: "bronze",
    status: "suspended",
    branches: [],
    invoices: [],
    createdAt: new Date("2024-01-10"),
    suspendedAt: new Date("2024-01-25"),
  },
]

export const mockBranches: Branch[] = [
  {
    id: "1",
    mitraId: "1",
    name: "Sari Jaya Sudirman",
    address: "Jl. Sudirman No. 123, Jakarta",
    phone: "081234567890",
    latitude: -6.2088,
    longitude: 106.8456,
    status: "active",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "2",
    mitraId: "1",
    name: "Sari Jaya Thamrin",
    address: "Jl. Thamrin No. 100, Jakarta",
    phone: "081234567890",
    latitude: -6.1944,
    longitude: 106.8229,
    status: "active",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    mitraId: "2",
    name: "Warung Bu Ina",
    address: "Jl. Thamrin No. 456, Jakarta",
    phone: "081234567891",
    latitude: -6.195,
    longitude: 106.8235,
    status: "pending",
    createdAt: new Date("2024-01-21"),
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    branchId: "1",
    customerName: "John Doe",
    customerPhone: "081234567893",
    categoryId: "1",
    itemDescription: "Tas laptop hitam",
    dropDate: new Date("2024-01-25"),
    duration: 3,
    totalAmount: 6000,
    status: "active",
    qrCode: "QR001",
    notes: "Barang dalam kondisi baik",
  },
  {
    id: "2",
    branchId: "1",
    customerName: "Jane Smith",
    customerPhone: "081234567894",
    categoryId: "2",
    itemDescription: "Koper biru ukuran sedang",
    dropDate: new Date("2024-01-24"),
    pickupDate: new Date("2024-01-26"),
    duration: 2,
    totalAmount: 10000,
    status: "picked_up",
    qrCode: "QR002",
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    mitraId: "1",
    invoiceNumber: "INV-2024-001",
    amount: 3000,
    dueDate: new Date("2024-02-15"),
    status: "paid",
    paidAt: new Date("2024-01-20"),
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    mitraId: "2",
    invoiceNumber: "INV-2024-002",
    amount: 2000,
    dueDate: new Date("2024-02-20"),
    status: "pending",
    createdAt: new Date("2024-01-20"),
  },
]

export const mockDashboardStats: DashboardStats = {
  totalMitra: 25,
  activeMitra: 18,
  suspendedMitra: 3,
  pendingVerification: 4,
  totalBranches: 42,
  newBranches24h: 2,
  dailyTransactions: 156,
  weeklyTrend: [120, 135, 142, 158, 163, 149, 156],
  popularCategories: [
    { name: "Kecil", count: 45 },
    { name: "Sedang", count: 32 },
    { name: "Besar", count: 18 },
    { name: "Kendaraan", count: 12 },
  ],
  totalInvoiceAmount: 50000,
  paidAmount: 35000,
  outstandingAmount: 15000,
  monthlyRevenue: [25000, 32000, 28000],
}
