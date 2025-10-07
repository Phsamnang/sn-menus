"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

type CartButtonProps = {
  itemCount: number
  totalPrice: number
  onClick: () => void
}

export function CartButton({ itemCount, totalPrice, onClick }: CartButtonProps) {
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
      <div className="container mx-auto max-w-2xl pointer-events-auto">
        <Button onClick={onClick} size="lg" className="w-full h-14 text-base font-semibold shadow-lg">
          <ShoppingBag className="w-5 h-5 mr-2" />
          <span className="flex-1 text-left">
            View Order ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-bold">${totalPrice.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  )
}
