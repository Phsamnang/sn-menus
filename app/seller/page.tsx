"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  Clock,
  CreditCard,
  DollarSign,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/service/order-service";

type Order = {
  id: string;
  tableNumber: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: "pending" | "completed" | "paid";
  timestamp: string;
  paymentMethod?: string;
  paymentTime?: string;
};

export default function SellerPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  };


   


  useEffect(() => {
    loadOrders();
    // Auto-refresh every 3 seconds
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const markAsPaid = (orderId: string, method: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: "paid" as const,
            paymentMethod: method,
            paymentTime: new Date().toISOString(),
          }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    toast({
      title: "Payment recorded!",
      description: `Order #${orderId.slice(-6)} marked as paid via ${method}`,
    });

    setIsPaymentDialogOpen(false);
    setSelectedOrder(null);
    setPaymentMethod("");
  };

  const clearPaidOrders = () => {
    const activeOrders = orders.filter((order) => order.status !== "paid");
    setOrders(activeOrders);
    localStorage.setItem("orders", JSON.stringify(activeOrders));

    toast({
      title: "Cleared paid orders",
      description: "All paid orders have been removed from the system",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "pending"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "completed"
  );
  const paidOrders = filteredOrders.filter((order) => order.status === "paid");

  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);


  console.log("Data working ........")

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Seller Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage orders and process payments
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">
                  ${totalRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadOrders}
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                {paidOrders.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearPaidOrders}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="hidden sm:inline">Clear Paid</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Search and Stats */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by table number or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingOrders.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedOrders.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold">{paidOrders.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold">
                Pending Orders{" "}
                <Badge variant="secondary">{pendingOrders.length}</Badge>
              </h2>
            </div>

            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No pending orders</p>
                </Card>
              ) : (
                pendingOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          Table {order.tableNumber}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-orange-500/10 text-orange-700 border-orange-200"
                      >
                        Pending
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-border gap-2">
                      <p className="font-bold">
                        Total: ${order.total.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => markAsPaid(order.id, "cash")}
                        className="w-full sm:w-auto"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Complete
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
              <Check className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold">
                Ready for Payment{" "}
                <Badge variant="secondary">{completedOrders.length}</Badge>
              </h2>
            </div>

            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No orders ready for payment
                  </p>
                </Card>
              ) : (
                completedOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          Table {order.tableNumber}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-700 border-blue-200"
                      >
                        Ready
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-border gap-2">
                      <p className="font-bold">
                        Total: ${order.total.toFixed(2)}
                      </p>
                      <Dialog
                        open={
                          isPaymentDialogOpen && selectedOrder?.id === order.id
                        }
                        onOpenChange={setIsPaymentDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Process Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Process Payment - Table {order.tableNumber}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">
                                Order Summary
                              </h4>
                              <div className="space-y-1">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span>
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="payment-method">
                                Payment Method
                              </Label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Button
                                  variant={
                                    paymentMethod === "cash"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => setPaymentMethod("cash")}
                                >
                                  Cash
                                </Button>
                                <Button
                                  variant={
                                    paymentMethod === "card"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => setPaymentMethod("card")}
                                >
                                  Card
                                </Button>
                                <Button
                                  variant={
                                    paymentMethod === "bank"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => setPaymentMethod("bank")}
                                >
                                  Bank
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                onClick={() =>
                                  markAsPaid(order.id, paymentMethod)
                                }
                                disabled={!paymentMethod}
                                className="flex-1"
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Confirm Payment
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsPaymentDialogOpen(false);
                                  setSelectedOrder(null);
                                  setPaymentMethod("");
                                }}
                                className="w-full sm:w-auto"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* Paid Orders */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold">
                Paid Orders{" "}
                <Badge variant="secondary">{paidOrders.length}</Badge>
              </h2>
            </div>

            <div className="space-y-4">
              {paidOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No paid orders</p>
                </Card>
              ) : (
                paidOrders.map((order) => (
                  <Card key={order.id} className="p-4 opacity-75">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          Table {order.tableNumber}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Paid at{" "}
                          {new Date(
                            order.paymentTime || order.timestamp
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-700 border-green-200"
                      >
                        Paid ({order.paymentMethod})
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="font-bold">
                        Total: ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
