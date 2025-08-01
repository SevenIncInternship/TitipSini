import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const mitra = await prisma.mitra.findUnique({
    where: { id: params.id },
    include: { owner: true },
  });
  if (!mitra) return NextResponse.json({ message: "Mitra not found" }, { status: 404 });
  return NextResponse.json(mitra);
}

// PUT (Update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updatedMitra = await prisma.mitra.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updatedMitra);
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.mitra.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: "Mitra deleted" });
}
