import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// GET: Ambil semua user
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { mitras: true }, // relasi mitra
  });
  return NextResponse.json(users);
}

// POST: Tambah user baru
export async function POST(req: Request) {
  const data = await req.json();

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role || "user", // default user
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
