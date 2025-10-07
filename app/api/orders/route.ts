import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, items } = body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Check if the table exists
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Check if the table is already occupied
    if (table.status === "OCCUPIED") {
      return NextResponse.json(
        { error: "Table is already occupied" },
        { status: 400 }
      );
    }

    // Calculate total using Decimal
    const total = items.reduce((sum: Prisma.Decimal, item: any) => {
      return sum.plus(new Prisma.Decimal(item.price).times(item.quantity));
    }, new Prisma.Decimal(0));

    // Create order with items
    const order = await prisma.order.create({
      data: {
        total,
        status: "PENDING",
        tableId,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: new Prisma.Decimal(item.price),
            menuItemId: item.menuItemId,
          })),
        },
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // Mark table as OCCUPIED after order creation
    await prisma.table.update({
      where: { id: tableId },
      data: { status: "OCCUPIED" },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
