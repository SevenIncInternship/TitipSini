import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Ambil semua mitra
export async function GET() {
  const mitras = await prisma.mitra.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: true }, // Relasi ke User
  });
  return NextResponse.json(mitras);
}

// POST: Tambah mitra baru
export async function POST(req: Request) {
  const data = await req.json();

  const newMitra = await prisma.mitra.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      tier: data.tier || "bronze",
      status: data.status || "pending",
      ownerId: data.ownerId || null,
    },
  });

  return NextResponse.json(newMitra, { status: 201 });
}
