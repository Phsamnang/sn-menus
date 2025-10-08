import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const orderId = parseInt(params.id);
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    include: {
      menuItem: true,
    },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      table: true,
    },
  });

 const mappedItems = Object.values(
   items.reduce((acc, item) => {
     const name = item.menuItem.name;

     if (!acc[name]) {
       acc[name] = {
         id: item.id,
         name,
         price: parseFloat(item.menuItem.price.toString()),
         quantity: item.quantity,
         image: item.menuItem.image || null,
       };
     } else {
       // sum quantity for the same item name
       acc[name].quantity += item.quantity;

       // (optional) update total price if needed
       // acc[name].price += parseFloat(item.menuItem.price.toString()) * item.quantity;
     }

     return acc;
   }, {} as Record<string, any>)
 );
  const mainResult = {
    ...order,
    items: mappedItems,
  };
  return NextResponse.json(ApiResponse.success(mainResult, "Items fetched successfully"));
}



