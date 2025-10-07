import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ApiResponse } from "@/lib/apiResponse";


// GET example


// POST example
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(ApiResponse.error("Missing required fields"));
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: new Prisma.Decimal(price),
        categoryId: parseInt(categoryId, 10),
      },
      include: { category: true },
    });

    return NextResponse.json(
      ApiResponse.success(menuItem, "Menu item created successfully")
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(ApiResponse.error("Failed to create menu item"));
  }
}
