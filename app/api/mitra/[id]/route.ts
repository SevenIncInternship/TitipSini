import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET mitra by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mitra = await prisma.mitra.findUnique({
      where: { id: params.id },
      include: { owner: true },
    });

    if (!mitra) {
      return NextResponse.json({ message: "Mitra not found" }, { status: 404 });
    }

    return NextResponse.json(mitra);
  } catch (err) {
    console.error("GET /mitra/[id] error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT (update mitra)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const updatedMitra = await prisma.mitra.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedMitra);
  } catch (err) {
    console.error("PUT /mitra/[id] error:", err);
    return NextResponse.json({ message: "Failed to update mitra" }, { status: 500 });
  }
}

// DELETE mitra by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.mitra.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Mitra deleted" });
  } catch (err) {
    console.error("DELETE /mitra/[id] error:", err);
    return NextResponse.json({ message: "Failed to delete mitra" }, { status: 500 });
  }
}
