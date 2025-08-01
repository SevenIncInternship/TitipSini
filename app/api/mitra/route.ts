import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

// GET: Ambil semua mitra
export async function GET() {
  try {
    const mitras = await prisma.mitra.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: true },
    })
    return NextResponse.json(mitras)
  } catch (error) {
    console.error("GET /api/mitra error:", error)
    return NextResponse.json({ error: "Gagal mengambil data mitra" }, { status: 500 })
  }
}

// POST: Tambah mitra baru
export async function POST(req: Request) {
  try {
    const data = await req.json()

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
    })

    return NextResponse.json(newMitra, { status: 201 })
  } catch (error) {
    console.error("POST /api/mitra error:", error)
    return NextResponse.json({ error: "Gagal menambahkan mitra" }, { status: 500 })
  }
}