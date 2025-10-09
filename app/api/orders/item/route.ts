import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import { OrderStatus, Prisma, TableStatus } from "@prisma/client";
import { getIO } from "@/lib/socketServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, menuItemId, quantity, price } = body;

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        menuItemId,
        quantity,
        price: new Prisma.Decimal(price).times(quantity),
      },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: {
        total: {
          increment: new Prisma.Decimal(price).times(quantity),
        },
      },
    });
    getIO().emit("order-item-created", orderItem);
    return NextResponse.json(
      ApiResponse.success(orderItem, "Order item successfully created", 200)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Failed to create order", data: null },
      { status: 500 }
    );
  }
}
