"use client"

import { Button } from "@/components/ui/button"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import type { CartItem } from "@/app/page"

type CartSheetProps = {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  totalPrice: number
}

export function CartSheet({ isOpen, onClose, cart, onUpdateQuantity, totalPrice }: CartSheetProps) {
  if (!isOpen) return null

  const handlePlaceOrder = () => {
    const tableNumber = Math.floor(Math.random() * 20) + 1 // Simulate table number
    const order = {
      id: Date.now().toString(),
      tableNumber,
      items: cart,
      totalPrice,
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem("restaurant_orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("restaurant_orders", JSON.stringify(existingOrders))

    alert(`Order placed successfully for Table ${tableNumber}! Your food will be ready soon.`)

    // Clear cart
    cart.forEach((item) => onUpdateQuantity(item.id, 0))
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Your Order</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-balance">{item.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">${item.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-r-none"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-l-none"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => onUpdateQuantity(item.id, 0)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <Button onClick={handlePlaceOrder} size="lg" className="w-full h-12 text-base font-semibold">
              Place Order
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
