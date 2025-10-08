"use client";

import { useState } from "react";
import { MenuHeader } from "@/components/menu-header";
import { MenuItem } from "@/components/menu-item";
import { MyOrdersButton } from "@/components/my-orders-button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { menuItemService } from "@/service/menus-service";

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


  const {data:items, isLoading} = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => await menuItemService.getAll(),
  })

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
    new Set(items?.map((item) => item.category))
  );
  const itemsByCategory = categories.map((category) => ({
    category,
    items: items?.filter((item) => item.category === category),
  }));

  return (
    <div className="min-h-screen pb-24">
      <MenuHeader />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        <div className="space-y-6 sm:space-y-8">
          {itemsByCategory.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-balance px-1">
                {category}
              </h2>
              <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4 pb-2">
                <div className="flex gap-3 sm:gap-4 min-w-min">
                  {items?.map((item) => (
                    <div
                      key={item.id}
                      className="w-[280px] sm:w-[300px] flex-shrink-0"
                    >
                      <MenuItem
                        item={item}
                        onOrder={handleOrderItem}
                        disabled={isOrdering}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <MyOrdersButton />
    </div>
  );
}
