import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        items: {
          include: {  
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(ApiResponse.error("Order not found"));
    }

    return NextResponse.json(ApiResponse.success(order, "Order fetched successfully"));
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(ApiResponse.error("Failed to fetch order"));
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.update({
      where: { id: parseInt(params.id) },
      data: { status:status==="completed" ? OrderStatus.COMPLETED : OrderStatus.PAID as OrderStatus },
    });

    return NextResponse.json(ApiResponse.success(order, "Order updated successfully"));
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(ApiResponse.error("Failed to update order"));
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    await prisma.order.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(ApiResponse.success("Order deleted successfully"));
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(ApiResponse.error("Failed to delete order"));
  }
}

// POST /api/orders/[id]/items - Add items to an existing order and update total
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(ApiResponse.error("No items provided"));
    }

    // Validate order exists
    const existingOrder = await prisma.order.findUnique({ where: { id: parseInt(params.id) } });
    if (!existingOrder) {
      return NextResponse.json(ApiResponse.error("Order not found"));
    }

    // Create items
    await prisma.orderItem.createMany({
      data: items.map((i) => ({
        orderId: parseInt(params.id),
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        price: new Prisma.Decimal(i.price),
        totalPrice: new Prisma.Decimal(i.price).times(i.quantity),
      })),
    });

    // Recalculate total
    const orderWithItems = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
      include: { items: true },
    });

    const newTotal = orderWithItems?.items.reduce((sum: Prisma.Decimal, item) => {
      return sum.plus(item.price.times(item.quantity));
    }, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0);

    const updated = await prisma.order.update({
      where: { id: parseInt(params.id) },
      data: { total: newTotal },
      include: {
        items: { include: { menuItem: true } },
      },
    });

    return NextResponse.json(ApiResponse.success(updated, "Items added to order successfully"));
  } catch (error) {
    console.error("Error adding items to order:", error);
    return NextResponse.json(ApiResponse.error("Failed to add items to order"));
  }
}
