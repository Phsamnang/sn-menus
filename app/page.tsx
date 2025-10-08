"use client";

import { useEffect, useState } from "react";
import { MenuHeader } from "@/components/menu-header";
import { MenuItem } from "@/components/menu-item";
import { MyOrdersButton } from "@/components/my-orders-button";
import { useQuery } from "@tanstack/react-query";
import { menuItemService } from "@/service/menus-service";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";


export default function MenuPage() {
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();
  const {data:items, isLoading} = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => await menuItemService.getAll(),
  })

  const params = useParams();

  useEffect(() => {
    const createOrder = async () => {
      const orderId = await menuItemService.create(parseInt(params.id as string));
      console.log(orderId);        
      toast({
        title: "Order created",
        description: "Order created successfully",
      });
        }
    createOrder();
  }, []);
  const categories = Array.from(
    new Set(items?.map((item:any) => item.category))
  );
  const itemsByCategory = categories.map((category:any) => ({
    category,
    items: items?.filter((item:any) => item.category === category),
  }));

  return (
    <div className="min-h-screen pb-24">
      <MenuHeader />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        <div className="space-y-6 sm:space-y-8">
          {itemsByCategory.map(({ category, items }) => (
            <section key={category as string}>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-balance px-1">
                {category}
              </h2>
              <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4 pb-2">
                <div className="flex gap-3 sm:gap-4 min-w-min">
                  {items?.map((item:any, index:number) => (
                    <div
                      key={item.id}
                      className="w-[280px] sm:w-[300px] flex-shrink-0"
                    >
                      <MenuItem
                        item={item}
                            onOrder={() => {
                          setIsOrdering(true);
                        }}
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
