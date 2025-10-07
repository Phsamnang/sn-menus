"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"

type MenuItemProps = {
  item: {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
  }
  onOrder: (item: MenuItemProps["item"], quantity: number) => void
  disabled?: boolean
}

export function MenuItem({ item, onOrder, disabled }: MenuItemProps) {
  const [quantity, setQuantity] = useState(0)

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(0, prev - 1))
  }

  const handleOrder = () => {
    if (quantity > 0) {
      onOrder(item, quantity)
      setQuantity(0)
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-square bg-muted">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-tight text-balance flex-1">{item.name}</h3>
          <span className="font-bold text-primary text-sm whitespace-nowrap">${item.price.toFixed(2)}</span>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 text-pretty flex-1">{item.description}</p>

        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 bg-transparent"
            onClick={handleDecrement}
            disabled={quantity === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center font-semibold">{quantity}</div>
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 bg-transparent" onClick={handleIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handleOrder} size="sm" className="w-full h-9" disabled={disabled || quantity === 0}>
          Order
        </Button>
      </div>
    </Card>
  )
}
