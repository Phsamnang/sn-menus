import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-items - Get all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
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
