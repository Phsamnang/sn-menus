"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"
import type { OrderItem } from "@/app/page"

type PlaceOrderButtonProps = {
  itemCount: number
  totalPrice: number
  orderItems: OrderItem[]
  onOrderPlaced: () => void
}

export function PlaceOrderButton({ itemCount, totalPrice, orderItems, onOrderPlaced }: PlaceOrderButtonProps) {
  const [isPlacing, setIsPlacing] = useState(false)

  if (itemCount === 0) return null

  const handlePlaceOrder = () => {
    setIsPlacing(true)

    // Get table number from URL or default to 1
    const urlParams = new URLSearchParams(window.location.search)
    const tableNumber = urlParams.get("table") || "1"

    // Create order object
    const order = {
      id: Date.now().toString(),
      tableNumber,
      items: orderItems,
      total: totalPrice,
      status: "pending" as const,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage for service page
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]))

    // Show success state
    setTimeout(() => {
      setIsPlacing(false)
      onOrderPlaced()
      alert("Order placed successfully! Our staff will prepare your order shortly.")
    }, 1000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
      <div className="container mx-auto max-w-2xl pointer-events-auto">
        <Button
          onClick={handlePlaceOrder}
          size="lg"
          className="w-full h-14 text-base font-semibold shadow-lg"
          disabled={isPlacing}
        >
          {isPlacing ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              <span>Order Placed!</span>
            </>
          ) : (
            <>
              <span className="flex-1 text-left">
                Place Order ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
