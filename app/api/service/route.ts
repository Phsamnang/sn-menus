import { ApiResponse } from "@/lib/apiResponse";
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
        order:{
          include:{
            table:true
          }
        }
      }
    });

    

    const mappedItems = service.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      status: item.status,
      image: item.menuItem.image,
      tableNumber: item.order.table.number,
      name: item.menuItem.name,
      paymentStatus: item.order.status,
    }));
    return NextResponse.json( ApiResponse.success(mappedItems, "Fetched pending menu items successfully"));
  } catch (error) {
    console.error("Error fetching pending menu items:", error);
    return NextResponse.json(ApiResponse.error("Failed to fetch pending menu items"));
  }
}
export async function POST(request: Request) {
  return Response.json({ message: "Hello, world!" });
}

export async function PUT(request: Request) {
  return Response.json({ message: "Hello, world!" });
}