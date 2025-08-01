import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("⏳ Menghitung total mitra");
const totalMitra = await prisma.mitra.count();
console.log("✅ totalMitra:", totalMitra);
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

    // Pendapatan bulanan
    const now = new Date();
    const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);

    const pendapatanBulanan = await prisma.transaction.aggregate({
      where: { createdAt: { gte: awalBulan } },
      _sum: { amount: true },
    });

    // Invoice bulan ini
    const invoiceBulanIni = await prisma.invoice.aggregate({
      where: { createdAt: { gte: awalBulan } },
      _sum: { total: true },
    });

    const sudahDibayar = await prisma.invoice.aggregate({
      where: {
        createdAt: { gte: awalBulan },
        status: "paid",
      },
      _sum: { total: true },
    });

    const outstanding = await prisma.invoice.aggregate({
      where: {
        createdAt: { gte: awalBulan },
        status: { in: ["pending", "overdue"] },
      },
      _sum: { total: true },
    });

    // Kategori terpopuler: Top 5 cabang berdasarkan jumlah transaksi
    const popularCategoriesRaw = await prisma.branch.findMany({
  take: 5,
  orderBy: {
    transaction: {
      _count: "desc",
    },
  },
  include: {
    _count: {
      select: {
        transaction: true,
      },
    },
  },
});

const popularCategories = popularCategoriesRaw.map((b: {
  name: string;
  _count: { transaction: number };
}) => ({
  name: b.name,
  count: b._count.transaction,
}));

    // Weekly trend: 7 hari terakhir
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
  mitraAktif: mitraAktif,
  mitraSuspended: mitraSuspended,
  mitraPending: mitraPending,
  totalCabang,
  transaksiHarian,
  pendapatanBulanan: pendapatanBulanan._sum.amount || 0,
  invoiceBulanIni: invoiceBulanIni._sum.total || 0,
  sudahDibayar: sudahDibayar._sum.total || 0,
  outstanding: outstanding._sum.total || 0,
  kategoriTerpopuler: popularCategories,
  weeklyTrend,
});


  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}