import React, { useEffect, useState } from "react";
import {
  Trash2,
  Package,
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useDeleteCartMutation,
  useGetCartItemsQuery,
  useUpdateCartMutation,
} from "@/features/Api/cartApi";
import PurchaseWrapper from "../MainProductPage/PurchaseWrapper";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetCartItemsQuery();
  console.log(data?.cartItems);
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (data?.cartItems) {
      setCartItems(data.cartItems);
      const qtyMap = {};
      data.cartItems.forEach((item) => {
        qtyMap[item.productId] = item.quantity;
      });
      setQuantities(qtyMap);
    }
  }, [data]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const itemToUpdate = cartItems.find((item) => item.productId === productId);
    if (!itemToUpdate) return;

    const payload = {
      productId: productId,
      quantity: parseInt(newQuantity),
      selectedSize: itemToUpdate.selectedSize,
    };
    console.log("Updating cart with payload:", payload);

    try {
      await updateCart(payload).unwrap();

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: parseInt(newQuantity) }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  function formatNumber(num) {
    const [integerPart, decimalPart] = num.toString().split(".");

    const lastThree = integerPart.slice(-3);
    const rest = integerPart.slice(0, -3);

    const restWithCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

    const formattedInteger = restWithCommas
      ? restWithCommas + "," + lastThree
      : lastThree;

    return decimalPart
      ? formattedInteger + "." + decimalPart
      : formattedInteger;
  }

  const handleDelete = async ({ productId, selectedSize }) => {
    await deleteCart({ productId, selectedSize });
    refetch();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {cartItems.length} items
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                  <ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 font-bold text-sm">0</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Looks like you haven't added any items to your cart yet.
                <br />
                Start shopping to fill it up!
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/collection")}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item._id}
                  className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2">
                        <img
                          src={item.photoUrl}
                          alt="Product"
                          className="w-24 h-28 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-2xl font-bold text-indigo-600">
                                Rs.{formatNumber(item.price)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  Size:
                                </span>
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {item.selectedSize}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                Qty:
                              </span>
                              <Input
                                type="number"
                                min="1"
                                className="w-16 h-10 text-center border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                                value={quantities[item.productId] || ""}
                                onChange={(e) => {
                                  const newVal = e.target.value;
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [item.productId]: newVal,
                                  }));
                                }}
                                onBlur={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    quantities[item.productId]
                                  )
                                }
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete({
                                  productId: item.productId,
                                  selectedSize: item.selectedSize,
                                })
                              }
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            Item Total:
                          </span>
                          <span className="font-semibold text-lg text-gray-800">
                            Rs.
                            {formatNumber(
                              item.price * item.quantity.toFixed(2)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Package className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xl font-bold text-gray-800">
                        Order Summary
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-800">
                          Rs.{formatNumber(subtotal.toFixed(2))}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Shipping Fee</span>
                        <span className="font-semibold text-gray-800">
                          Rs.{formatNumber(shippingFee.toFixed(2))}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">
                            Total
                          </span>
                          <span className="text-2xl font-bold text-indigo-600">
                            Rs.{formatNumber(total.toFixed(2))}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        <PurchaseWrapper mode="cart" />

                        <Button
                          variant="outline"
                          onClick={() => navigate("/")}
                          className="w-full h-12 border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-medium rounded-xl transition-colors duration-200"
                        >
                          Continue Shopping
                        </Button>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-2">
                            Secure Checkout
                          </p>
                          <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
                            <span>🔒</span>
                            <span>SSL Encrypted</span>
                            <span>•</span>
                            <span>Free Returns</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
