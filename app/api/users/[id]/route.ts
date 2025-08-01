import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { mitras: true },
  });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

// PUT (update user)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updatedUser = await prisma.user.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updatedUser);
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.user.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: "User deleted" });
}
