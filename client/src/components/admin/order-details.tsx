import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Package, Truck, CheckCircle, Clock, MapPin, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { OrderWithDetails } from "@/lib/types";

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderWithDetails | null;
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "processing", label: "Processing", icon: Package },
  { value: "shipped", label: "Shipped", icon: Truck },
  { value: "completed", label: "Completed", icon: CheckCircle },
  { value: "cancelled", label: "Cancelled", icon: X },
];

export default function OrderDetails({ isOpen, onClose, order }: OrderDetailsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "pending");

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    const Icon = statusOption?.icon || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusUpdate = () => {
    if (order && selectedStatus !== order.status) {
      updateStatusMutation.mutate({
        orderId: order.id,
        status: selectedStatus,
      });
    }
  };

  if (!order) return null;

  const orderTotal = parseFloat(order.total);
  const subtotal = order.items.reduce((sum, item) => 
    sum + (parseFloat(item.price) * item.quantity), 0
  );
  const tax = orderTotal - subtotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span>Order #{order.id}</span>
              <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 capitalize`}>
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <option.icon className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedStatus !== order.status && (
                      <Button
                        size="sm"
                        onClick={handleStatusUpdate}
                        disabled={updateStatusMutation.isPending}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <div className="flex items-start space-x-2 mt-1">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          {order.user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{order.user.firstName} {order.user.lastName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{order.user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Username:</span>
                  <span>{order.user.username}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.product?.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">Price: ${item.price}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${orderTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Package className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              <Truck className="mr-2 h-4 w-4" />
              Track Package
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Email Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
