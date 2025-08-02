import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Mulai seeding database...");

  // Hapus semua data lama (hanya untuk development!)
  await prisma.invoice.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.mitra.deleteMany();
  await prisma.user.deleteMany();

  // Buat Superadmin user
  const superadminPassword = await bcrypt.hash("superadmin123", 10);
  const superadmin = await prisma.user.create({
    data: {
      email: "superadmin@admin.com",
      password: superadminPassword,
      role: "superadmin",
    },
  });

  // Buat 5 Mitra
  for (let i = 1; i <= 5; i++) {
    const mitra = await prisma.mitra.create({
      data: {
        name: `Mitra ${i}`,
        email: `mitra${i}@example.com`,
        phone: `08123${i}45678`,
        address: `Jl. Mitra No.${i}`,
        tier: i % 2 === 0 ? "gold" : "silver",
        status: i % 3 === 0 ? "suspended" : i % 2 === 0 ? "active" : "pending",
        ownerId: superadmin.id,
      },
    });

    // Buat 2 Branch + 3 transaksi per branch
    for (let b = 1; b <= 2; b++) {
      const branch = await prisma.branch.create({
        data: {
          name: `Branch ${b} Mitra ${i}`,
          address: `Jl. Cabang No.${b} Mitra ${i}`,
          mitraId: mitra.id,
        },
      });

      await Promise.all(
        Array.from({ length: 3 }).map((_, t) =>
          prisma.transaction.create({
            data: {
              customerName: `Customer ${t + 1}`,
              itemDescription: `Barang ${t + 1} dari ${branch.name}`,
              totalAmount: Math.floor(Math.random() * 1000000) + 50000,
              status: ["active", "picked_up", "overdue"][
                Math.floor(Math.random() * 3)
              ],
              branchId: branch.id,
            },
          })
        )
      );
    }

    // Buat 2 Invoice per mitra
    await Promise.all(
      Array.from({ length: 2 }).map((_, inv) =>
        prisma.invoice.create({
          data: {
            invoiceNumber: `INV-${i}${inv + 1}${Date.now()}`,
            amount: Math.floor(Math.random() * 2000000) + 100000,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            status: ["paid", "pending", "overdue"][
              Math.floor(Math.random() * 3)
            ],
            mitraId: mitra.id,
          },
        })
      )
    );
  }

  console.log("✅ Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error saat seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
