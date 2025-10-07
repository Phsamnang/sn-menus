import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, paymentMethod } = body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
      updateData.paymentTime = new Date();
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}

// POST /api/orders/[id]/items - Add items to an existing order and update total
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { items } = body as {
      items: Array<{ menuItemId: number; quantity: number; price: string | number }>;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Validate order exists
    const existingOrder = await prisma.order.findUnique({ where: { id: Number(params.id) } });
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create items
    await prisma.orderItem.createMany({
      data: items.map((i) => ({
        orderId: Number(params.id),
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        price: new Prisma.Decimal(i.price),
      })),
    });

    // Recalculate total
    const orderWithItems = await prisma.order.findUnique({
      where: { id: Number(params.id) },
      include: { items: true },
    });

    const newTotal = orderWithItems?.items.reduce((sum: Prisma.Decimal, item) => {
      return sum.plus(item.price.times(item.quantity));
    }, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0);

    const updated = await prisma.order.update({
      where: { id: Number(params.id) },
      data: { total: newTotal },
      include: {
        items: { include: { menuItem: true } },
      },
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (error) {
    console.error("Error adding items to order:", error);
    return NextResponse.json(
      { error: "Failed to add items to order" },
      { status: 500 }
    );
  }
}
