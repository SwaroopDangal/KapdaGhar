import React, { useState } from "react";
import { CheckCircle, Truck, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMyOrdersQuery } from "@/features/Api/purchaseApi";
import { useNavigate } from "react-router-dom";

const MyOrderPage = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery();
  const orders = data?.orders || [];
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case "PLACED":
        return <CheckCircle className="w-4 h-4" />;
      case "ON_THE_WAY":
        return <Truck className="w-4 h-4" />;
      case "DELIVERED":
        return <Package className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "text-blue-600";
      case "ON_THE_WAY":
        return "text-orange-600";
      case "DELIVERED":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.deliveryStatus === statusFilter);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load orders.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">MY ORDERS</h2>

      {/* Filter Options */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "PLACED", "ON_THE_WAY", "DELIVERED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.orderId}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="flex items-start p-4 gap-4">
              <img
                src={order.productPhotoUrl}
                onClick={() => navigate(`/product/${order.productId}`)}
                alt="Product"
                className="w-20 h-24 object-cover rounded-md border bg-gray-100 cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-lg">{order.productName}</p>
                <p className="text-muted-foreground">
                  Rs.{order.amount} &nbsp; Quantity: {order.quantity} &nbsp;
                  Size: {order.size}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(
                  order.deliveryStatus
                )}`}
              >
                {getStatusIcon(order.deliveryStatus)}
                {order.deliveryStatus}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No orders found for the selected status.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;
