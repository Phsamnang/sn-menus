import { prisma } from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const service = await prisma.orderItem.findMany({
      where: {
        status: ItemStatus.PENDING, // 👈 filter only pending items
      },
      orderBy: {
        id: "desc", // optional: newest first
      },
      include:{
        menuItem:true,
        order:true
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching pending menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending menu items" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  return Response.json({ message: "Hello, world!" });
}

export async function PUT(request: Request) {
  return Response.json({ message: "Hello, world!" });
}