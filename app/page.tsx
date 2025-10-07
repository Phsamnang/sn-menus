"use client";

import { useState, useEffect } from "react";
import { MenuHeader } from "@/components/menu-header";
import { MenuItem } from "@/components/menu-item";
import { MyOrdersButton } from "@/components/my-orders-button";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 12.99,
    image: "/delicious-burger-with-cheese.jpg",
    category: "Mains",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil",
    price: 14.99,
    image: "/margherita-pizza.png",
    category: "Mains",
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, and Caesar dressing",
    price: 9.99,
    image: "/fresh-caesar-salad.png",
    category: "Salads",
  },
  {
    id: "4",
    name: "Grilled Salmon",
    description: "Atlantic salmon with seasonal vegetables and lemon butter",
    price: 18.99,
    image: "/grilled-salmon-fillet.jpg",
    category: "Mains",
  },
  {
    id: "5",
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon, egg, and parmesan",
    price: 13.99,
    image: "/creamy-pasta-carbonara.png",
    category: "Mains",
  },
  {
    id: "6",
    name: "Chicken Wings",
    description: "Crispy wings with your choice of sauce",
    price: 10.99,
    image: "/chicken-wings.jpg",
    category: "Appetizers",
  },
  {
    id: "7",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla ice cream",
    price: 7.99,
    image: "/chocolate-lava-cake.png",
    category: "Desserts",
  },
  {
    id: "8",
    name: "Iced Latte",
    description: "Smooth espresso with cold milk over ice",
    price: 4.99,
    image: "/iced-latte-coffee.jpg",
    category: "Beverages",
  },
];

export default function MenuPage() {
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = useState(false);
  const [dynamicMenuItems, setDynamicMenuItems] = useState(menuItems);

  // Load menu items from localStorage on component mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    if (storedItems.length > 0) {
      setDynamicMenuItems(storedItems);
    }
  }, []);

  const handleOrderItem = (item: (typeof menuItems)[0], quantity: number) => {
    if (isOrdering) return;

    setIsOrdering(true);

    // Get table number from URL or default to 1
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get("table") || "1";

    // Create order object with item and quantity
    const order = {
      id: Date.now().toString(),
      tableNumber,
      items: [
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
        },
      ],
      total: item.price * quantity,
      status: "pending" as const,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage for service page
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));

    // Show success notification
    toast({
      title: "Order placed!",
      description: `${quantity}x ${item.name} ordered for Table ${tableNumber}`,
    });

    setTimeout(() => setIsOrdering(false), 500);
  };

  const categories = Array.from(
    new Set(dynamicMenuItems.map((item) => item.category))
  );
  const itemsByCategory = categories.map((category) => ({
    category,
    items: dynamicMenuItems.filter((item) => item.category === category),
  }));

  return (
    <div className="min-h-screen pb-8">
      <MenuHeader />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-8">
          {itemsByCategory.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-4 text-balance">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onOrder={handleOrderItem}
                    disabled={isOrdering}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <MyOrdersButton />
    </div>
  );
}
