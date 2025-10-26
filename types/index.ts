export interface User {
  id: string
  email: string
  name: string
  role: "superadmin" | "customer" | "finance" | "vendor"
  status: "active" | "suspended"
  createdAt: Date
}

export interface Mitra {
  id: string
  name: string
  email: string
  phone: string
  address: string
  tier: "bronze" | "silver" | "gold"
  status: "pending" | "pending_payment" | "active" | "suspended"
  branches: Branch[]
  invoices: Invoice[]
  createdAt: Date
  verifiedAt?: Date
  suspendedAt?: Date
}

export interface Branch {
  id: string
  mitraId: string
  name: string
  address: string
  phone: string
  latitude: number
  longitude: number
  status: "pending" | "active" | "rejected"
  createdAt: Date
}

export interface TierPlan {
  id: string
  name: "bronze" | "silver" | "gold"
  maxBranches: number
  monthlyPrice: number
  features: string[]
}

export interface Category {
  id: string
  name: string
  dailyRate: number 
  description: string
  order: number
}

export interface Transaction {
  id: string
  branchId: string
  customerName: string
  customerPhone: string
  categoryId: string
  itemDescription: string
  dropDate: Date
  pickupDate?: Date
  duration: number
  totalAmount: number
  status: "active" | "picked_up" | "overdue"
  qrCode: string
  notes?: string
}

export interface Invoice {
  id: string
  mitraId: string
  invoiceNumber: string
  amount: number
  dueDate: Date
  status: "pending" | "paid" | "overdue"
  paymentProof?: string
  paidAt?: Date
  createdAt: Date
}

export interface DashboardStats {
  totalMitra: number
  activeMitra: number
  suspendedMitra: number
  pendingVerification: number
  totalBranches: number
  newBranches24h: number
  dailyTransactions: number
  weeklyTrend: number[]
  popularCategories: { name: string; count: number }[]
  totalInvoiceAmount: number
  paidAmount: number
  outstandingAmount: number
  monthlyRevenue: number[]
}
