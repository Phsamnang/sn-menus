import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
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
    const { tableNumber, items } = body;

    if (!tableNumber || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        tableNumber,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            menuItemId: item.menuItemId,
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
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
