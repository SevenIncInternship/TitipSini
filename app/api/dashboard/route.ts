import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Mitra
    const totalMitra = await prisma.mitra.count();
    const mitraAktif = await prisma.mitra.count({ where: { status: "active" } });
    const mitraSuspended = await prisma.mitra.count({ where: { status: "suspended" } });
    const mitraPending = await prisma.mitra.count({ where: { status: "pending" } });

    // Cabang
    const totalCabang = await prisma.branch.count();

    // Transaksi harian
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const transaksiHarian = await prisma.transaction.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    });

    // Pendapatan bulanan (sum totalAmount)
    const now = new Date();
    const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);

    const pendapatanBulanan = await prisma.transaction.aggregate({
      where: { createdAt: { gte: awalBulan } },
      _sum: { totalAmount: true },
    });

    // Invoice
    const invoiceBulanIni = await prisma.invoice.aggregate({
      where: { createdAt: { gte: awalBulan } },
      _sum: { amount: true },
    });

    const sudahDibayar = await prisma.invoice.aggregate({
      where: {
        createdAt: { gte: awalBulan },
        status: "paid",
      },
      _sum: { amount: true },
    });

    const outstanding = await prisma.invoice.aggregate({
      where: {
        createdAt: { gte: awalBulan },
        status: { in: ["pending", "overdue"] },
      },
      _sum: { amount: true },
    });

    // Kategori terpopuler: ambil top 5 branch berdasarkan jumlah transaksi
    const popularCategoriesRaw = await prisma.branch.findMany({
      take: 5,
      include: {
        transactions: true,
      },
    });

    const popularCategories = popularCategoriesRaw.map((b) => ({
      name: b.name,
      count: b.transactions.length,
    }));

    // Weekly trend (jumlah transaksi 7 hari terakhir)
    const weeklyTrend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(now.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setDate(now.getDate() - i);
      end.setHours(23, 59, 59, 999);

      const count = await prisma.transaction.count({
        where: { createdAt: { gte: start, lte: end } },
      });

      weeklyTrend.push(count);
    }

    return NextResponse.json({
      totalMitra,
      activeMitra: mitraAktif,
      suspendedMitra: mitraSuspended,
      pendingVerification: mitraPending,
      totalBranches: totalCabang,
      dailyTransactions: transaksiHarian,
      monthlyRevenue: [pendapatanBulanan._sum.totalAmount || 0],
      totalInvoiceAmount: invoiceBulanIni._sum.amount || 0,
      paidAmount: sudahDibayar._sum.amount || 0,
      outstandingAmount: outstanding._sum.amount || 0,
      popularCategories,
      weeklyTrend,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
