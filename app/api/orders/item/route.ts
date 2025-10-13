import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import { OrderStatus, Prisma, TableStatus } from "@prisma/client";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, menuItemId, quantity, price } = body;

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        menuItemId,
        quantity,
        price,
        totalPrice: new Prisma.Decimal(price).times(quantity),
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
    return NextResponse.json(
      ApiResponse.success(orderItem, "Order item successfully created", 200)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(ApiResponse.error("Failed to create order item"));
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, orderId } = body;
    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
    });
    await prisma.orderItem.delete({
      where: { id },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: {
        total: { decrement: orderItem?.price.times(orderItem?.quantity) },
      },
    });
    return NextResponse.json(
      ApiResponse.success("Order item successfully deleted")
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(ApiResponse.error("Failed to delete order item"));
  }
}
