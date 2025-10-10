"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { orderService } from "@/service/order-service"

type Order = {
  id: string
  tableNumber: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }[]
  total: number
  status: "pending" | "completed"
  timestamp: string
}

export default function ServicePage() {
  const [orders, setOrders] = useState<Order[]>([])

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(storedOrders)
  }


  const orderItem=useQuery({
    queryFn:()=>orderService.getOrderItem(),
    queryKey:['order-items']
  })



  console.log("data",orderItem)


  useEffect(() => {
    loadOrders()
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const markAsCompleted = (orderId: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "completed" as const } : order,
    )
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const clearCompletedOrders = () => {
    const activeOrders = orders.filter((order) => order.status === "pending")
    setOrders(activeOrders)
    localStorage.setItem("orders", JSON.stringify(activeOrders))
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const completedOrders = orders.filter((order) => order.status === "completed")

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Service Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage customer orders</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {completedOrders.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompletedOrders}>
                  Clear Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold">
                Pending Orders <Badge variant="secondary">{pendingOrders.length}</Badge>
              </h2>
            </div>

            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No pending ordersdrdsddsds</p>
                </Card>
              ) : (
                pendingOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold">Table {order.tableNumber}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 border-orange-200">
                        Pending
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
                      <Button size="sm" onClick={() => markAsCompleted(order.id)}>
                        <Check className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* Completed Orders */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold">
                Completed Orders <Badge variant="secondary">{completedOrders.length}</Badge>
              </h2>
            </div>

            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No completed orders</p>
                </Card>
              ) : (
                completedOrders.map((order) => (
                  <Card key={order.id} className="p-4 opacity-75">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold">Table {order.tableNumber}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
