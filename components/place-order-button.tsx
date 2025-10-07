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

  const handlePlaceOrder = async () => {
    setIsPlacing(true)

    const urlParams = new URLSearchParams(window.location.search)
    const tableNumber = urlParams.get("table") || "1"

    try {
      // Step 1: create empty order
      const createRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber }),
      })
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to create order")
      }
      const created = await createRes.json()

      // Step 2: add items
      const itemsPayload = {
        items: orderItems.map((it) => ({
          menuItemId: Number(it.id),
          quantity: it.quantity,
          price: it.price,
        })),
      }
      const itemsRes = await fetch(`/api/orders/${created.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemsPayload),
      })
      if (!itemsRes.ok) {
        const err = await itemsRes.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to add items to order")
      }

      onOrderPlaced()
      alert("Order placed successfully! Our staff will prepare your order shortly.")
    } catch (e: any) {
      alert(e?.message || "Failed to place order")
    } finally {
      setIsPlacing(false)
    }
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
