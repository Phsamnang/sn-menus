import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuItems = [
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 12.99,
    category: "Mains",
    image: "/delicious-burger-with-cheese.jpg",
  },
  {
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil",
    price: 14.99,
    category: "Mains",
    image: "/margherita-pizza.png",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, and Caesar dressing",
    price: 9.99,
    category: "Salads",
    image: "/fresh-caesar-salad.png",
  },
  {
    name: "Grilled Salmon",
    description: "Atlantic salmon with seasonal vegetables and lemon butter",
    price: 18.99,
    category: "Mains",
    image: "/grilled-salmon-fillet.jpg",
  },
  {
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon, egg, and parmesan",
    price: 13.99,
    category: "Mains",
    image: "/creamy-pasta-carbonara.png",
  },
  {
    name: "Chicken Wings",
    description: "Crispy wings with your choice of sauce",
    price: 10.99,
    category: "Appetizers",
    image: "/chicken-wings.jpg",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla ice cream",
    price: 7.99,
    category: "Desserts",
    image: "/chocolate-lava-cake.png",
  },
  {
    name: "Iced Latte",
    description: "Smooth espresso with cold milk over ice",
    price: 4.99,
    category: "Beverages",
    image: "/iced-latte-coffee.jpg",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

  // Create menu items
  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
