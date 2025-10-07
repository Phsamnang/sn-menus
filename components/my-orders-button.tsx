"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Receipt, Clock, CheckCircle2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type Order = {
  id: string
  tableNumber: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: "pending" | "completed"
  timestamp: string
}

export function MyOrdersButton() {
  const [orders, setOrders] = useState<Order[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const loadOrders = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const tableNumber = urlParams.get("table") || "1"

      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const myOrders = allOrders.filter((order: Order) => order.tableNumber === tableNumber)
      setOrders(myOrders)
    }

    loadOrders()

    // Refresh orders when sheet is opened
    if (open) {
      loadOrders()
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      loadOrders()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [open])

  const pendingCount = orders.filter((order) => order.status === "pending").length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="fixed bottom-6 right-6 h-14 px-6 shadow-lg rounded-full">
          <Receipt className="h-5 w-5 mr-2" />
          My Orders
          {pendingCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {pendingCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">My Orders</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            orders
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((order) => (
                <Card key={order.id} className="p-6 bg-background">
                  <div className="text-center mb-6 pb-4 border-b-2 border-dashed">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Receipt className="h-5 w-5" />
                      <h3 className="font-bold text-lg">ORDER RECEIPT</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Order #{order.id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.timestamp).toLocaleString()}</p>
                    <div className="mt-3 flex justify-center">
                      <Badge variant={order.status === "pending" ? "default" : "secondary"}>
                        {order.status === "pending" ? (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2 px-1">
                      <span>ITEM</span>
                      <span>AMOUNT</span>
                    </div>
                    {order.items.map((item, index) => (
                      <div key={index} className="py-2">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-sm ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 px-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between items-center pt-2 pb-1">
                      <span className="font-bold text-lg">TOTAL TO PAY</span>
                      <span className="font-bold text-2xl text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-dashed text-center">
                    <p className="text-xs text-muted-foreground">Thank you for your order!</p>
                  </div>
                </Card>
              ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
