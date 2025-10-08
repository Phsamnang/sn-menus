import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma, TableStatus } from "@prisma/client";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableId } = body;

    // check if table exists
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      return NextResponse.json(
        { status: false, message: "Table not found", data: null },
        { status: 404 }
      );
    }

	if (table.status !== TableStatus.AVAILABLE) {
		const order = await prisma.order.findFirst({
			where: { tableId },
		});
		return NextResponse.json(
			ApiResponse.success(order, "Order successfully fetched", 200)
		);
	}

    // create order
    const order = await prisma.order.create({
      data: { tableId, total: new Prisma.Decimal(0), status: OrderStatus.PENDING },
    });

    // update table status
    await prisma.table.update({
      where: { id: tableId },
      data: { status: TableStatus.OCCUPIED },
    });

    return NextResponse.json({
      status: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Failed to create order", data: null },
      { status: 500 }
    );
  }
}
