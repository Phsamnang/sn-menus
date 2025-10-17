import { ApiResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { ItemStatus, OrderStatus } from "@prisma/client";
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
      include: {
        menuItem: true,
        order: {
          include: {
            table: true,
          },
        },
      },
    });

    const order = await prisma.order.findMany({
      include: {
        table: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedItems = service.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      status: item.status,
      image: item.menuItem.image,
      tableNumber: item.order.table.number,
      name: item.menuItem.name,
      paymentStatus: item.order.status,
      timestamp: item.order.createdAt,
      total: item.order.total,
    }));

    const mainResult = order.map((order) => ({
      id: order.id,
      tableName: order.table.number,
      paymentStatus: order.status,
      total: order.total,
      items: mappedItems.filter(
        (item) => item.tableNumber === order.table.number
      ),
      timestamp: order.createdAt,
    }));

    return NextResponse.json(
      ApiResponse.success(mainResult, "Fetched pending menu items successfully")
    );
  } catch (error) {
    console.error("Error fetching pending menu items:", error);
    return NextResponse.json(
      ApiResponse.error("Failed to fetch pending menu items")
    );
  }
}
export async function POST(request: Request) {
  return Response.json({ message: "Hello, world!" });
}

export async function PUT(request: Request) {
  return Response.json({ message: "Hello, world!" });
}
