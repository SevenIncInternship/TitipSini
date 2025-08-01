import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// GET: Ambil semua user
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { mitra: true }, // relasi mitra
  });
  return NextResponse.json(users);
}

// POST: Tambah user baru
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.password || !data.role) {
      return NextResponse.json({ error: "Email, password, dan role wajib diisi" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || "",
        password: hashedPassword,
        role: data.role || "user",
        status: "active",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: "Gagal menambahkan user" }, { status: 500 });
  }
}