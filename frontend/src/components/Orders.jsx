import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetAllOrdersQuery,
  useUpdateDeliveryStatusMutation,
} from "@/features/Api/purchaseApi";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import DialogProductCard from "./DialogProductCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ButtonLoader from "./ButtonLoader";
import { Loader2 } from "lucide-react";

const Orders = () => {
  const { data, isLoading, refetch } = useGetAllOrdersQuery();
  const totalOrders = data?.totalOrders;
  const deliveredOrders = data?.deliveredOrders;
  const onTheWayOrders = data?.onTheWayOrders;
  const totalRevenue = data?.totalRevenue;
  const orders = data?.orders;

  const [
    updateDeliveryStatus,
    { isSuccess, isError, isLoading: updateLoading, data: updateData },
  ] = useUpdateDeliveryStatusMutation();

  // Change to track which order dialog is open and its selected status
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    orderId: null,
    selectedStatus: "",
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      PLACED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
      },
      ON_THE_WAY: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      },
      DELIVERED: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      },
    };

    const config = statusConfig[status] || statusConfig.PLACED;

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} shadow-sm`}
      >
        {status}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(price || 0)
      .replace("₹", "Rs. ");
  };

  const openStatusDialog = (orderId) => {
    setDialogState({
      isOpen: true,
      orderId: orderId,
      selectedStatus: "",
    });
  };

  const closeStatusDialog = () => {
    setDialogState({
      isOpen: false,
      orderId: null,
      selectedStatus: "",
    });
  };

  const handleStatusUpdate = async () => {
    if (!dialogState.selectedStatus) {
      return toast.error("Please select a status first!");
    }

    await updateDeliveryStatus({
      status: dialogState.selectedStatus,
      purchaseId: dialogState.orderId,
    }).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateData?.message || "Updated successfully", {
        style: {
          background: "linear-gradient(135deg, #10b981, #059669)",
        },
      });
      refetch();
      closeStatusDialog();
    }

    if (isError) {
      toast.error(updateData?.message || "Update failed");
    }
  }, [isError, isSuccess, updateData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 ml-16 md:ml-8 px-4 md:px-0">
      <div className="flex items-center  justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
          Order Management
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Orders",
            value: totalOrders,
            color: "from-blue-500 via-blue-600 to-blue-700",
            icon: "📦",
          },
          {
            label: "On the Way Orders",
            value: onTheWayOrders,
            color: "from-yellow-500 via-yellow-600 to-orange-500",
            icon: "🚚",
          },
          {
            label: "Delivered Orders",
            value: deliveredOrders,
            color: "from-green-500 via-green-600 to-emerald-600",
            icon: "✅",
          },
          {
            label: "Total Revenue",
            value: formatPrice(totalRevenue),
            color: "from-purple-500 via-purple-600 to-indigo-600",
            icon: "💰",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className={`border-0 shadow-xl bg-gradient-to-br ${stat.color} text-white transform hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <h3 className="text-sm font-medium opacity-90 mb-2">
                {stat.label}
              </h3>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/50 to-red-50/50 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {orders?.map((order, i) => (
              <div
                key={order.orderId}
                className="group relative flex flex-col lg:flex-row lg:items-center lg:justify-between p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 hover:shadow-lg hover:bg-white/90 transition-all duration-300 space-y-4 lg:space-y-0 hover:border-orange-200/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      #{i + 1}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h1 className="font-bold text-lg text-gray-800">
                      {order.userName}
                    </h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        📦 {order.quantity} items
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(order.deliveryStatus)}
                    <div className="text-right">
                      <div className="font-bold text-xl text-gray-800">
                        {formatPrice(order.amount)}
                      </div>
                      <div className="text-xs text-gray-500">Total Amount</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-sm px-4 py-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="backdrop-blur-sm bg-white/10">
                        <DialogProductCard
                          product={{
                            _id: order?.productId,
                            name: order?.productName,
                            photoUrl: order?.productPhotoUrl,
                            price: order?.productPrice,
                          }}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      className="rounded-xl text-sm px-6 py-2.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium"
                      onClick={() => openStatusDialog(order.orderId)}
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Change Status
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-transparent to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Single dialog outside the map - controlled by dialogState */}
      <Dialog
        open={dialogState.isOpen}
        onOpenChange={(open) => {
          if (!open) closeStatusDialog();
        }}
      >
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl rounded-2xl">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Update Order Status
              </h2>
              <p className="text-gray-600 text-sm">
                Select the new status for order
              </p>
            </div>

            {/* Status Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                Order Status
              </label>
              <Select
                onValueChange={(value) =>
                  setDialogState((prev) => ({ ...prev, selectedStatus: value }))
                }
                value={dialogState.selectedStatus}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                  <SelectValue
                    placeholder="Choose status..."
                    className="text-gray-700 font-medium"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-xl bg-white/95 backdrop-blur-lg">
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                      Order Status
                    </SelectLabel>

                    <SelectItem
                      value="PLACED"
                      className="rounded-lg mx-2 my-1 hover:bg-blue-50 focus:bg-blue-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-blue-800">
                            Placed
                          </div>
                          <div className="text-xs text-blue-600">
                            Order confirmed
                          </div>
                        </div>
                      </div>
                    </SelectItem>

                    <SelectItem
                      value="ON_THE_WAY"
                      className="rounded-lg mx-2 my-1 hover:bg-yellow-50 focus:bg-yellow-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-yellow-800">
                            On the Way
                          </div>
                          <div className="text-xs text-yellow-600">
                            Out for delivery
                          </div>
                        </div>
                      </div>
                    </SelectItem>

                    <SelectItem
                      value="DELIVERED"
                      className="rounded-lg mx-2 my-1 hover:bg-green-50 focus:bg-green-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-green-800">
                            Delivered
                          </div>
                          <div className="text-xs text-green-600">
                            Successfully delivered
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium"
                disabled={updateLoading}
                onClick={handleStatusUpdate}
              >
                {updateLoading ? <ButtonLoader /> : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
