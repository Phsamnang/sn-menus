import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/apiResponse";

// GET /api/menu-items - Get all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: { category: true },
    });

    // Map to desired structure
    const mappedItems = menuItems.map((item) => ({
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.toString()), // convert Decimal to number
      category: item.category.name, // map category object to string
      image: item.image || null,
    }));

    return NextResponse.json(
      ApiResponse.success(mappedItems, "Fetched menu items successfully")
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(ApiResponse.error("Failed to fetch menu items"));
  }
}

// POST /api/menu-items - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, image } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || null,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
