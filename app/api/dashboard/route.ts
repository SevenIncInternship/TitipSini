import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    console.log("📡 Masuk ke API dashboard");
  try {
    const now = new Date();
    const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Eksekusi paralel agar lebih cepat
    const [
      totalMitra,
      mitraAktif,
      mitraSuspended,
      mitraPending,
      totalCabang,
      transaksiHarian,
      pendapatanBulanan,
      invoiceBulanIni,
      sudahDibayar,
      outstanding,
      popularCategoriesRaw
    ] = await Promise.all([
      prisma.mitra.count(),
      prisma.mitra.count({ where: { status: "active" } }),
      prisma.mitra.count({ where: { status: "suspended" } }),
      prisma.mitra.count({ where: { status: "pending" } }),
      prisma.branch.count(),
      prisma.transaction.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.transaction.aggregate({
        where: { createdAt: { gte: awalBulan } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { createdAt: { gte: awalBulan } },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: {
          createdAt: { gte: awalBulan },
          status: "paid",
        },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: {
          createdAt: { gte: awalBulan },
          status: { in: ["pending", "overdue"] },
        },
        _sum: { total: true },
      }),
      prisma.branch.findMany({
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
      }),
    ]);

    const popularCategories = popularCategoriesRaw.map((b: {
  name: string;
  _count: { transaction: number };
}) => ({
  name: b.name,
  count: b._count.transaction,
}));

    // Weekly Trend
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
      mitraAktif,
      mitraSuspended,
      mitraPending,
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