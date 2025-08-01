import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/features/Api/productApi";
import { useAddToCartMutation } from "@/features/Api/cartApi";
import { toast } from "sonner";
import ButtonLoader from "@/components/ButtonLoader";
import PurchaseWrapper from "./PurchaseWrapper";

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductMain() {
  const { productId } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(productId);

  const [
    addToCart,
    {
      isSuccess: cartSuccess,
      isError: cartError,
      isLoading: cartLoading,
      data: cartData,
    },
  ] = useAddToCartMutation();
  console.log(data)

  const product = data?.product;
  console.log(product);

  const [selectedSize, setSelectedSize] = useState("");
  console.log(selectedSize);

  const handleAdd = async () => {
    if (selectedSize == "") {
      toast.error("Select a size first");
    } else {
      await addToCart({ productId, quantity: 1, selectedSize });
    }
  };

  useEffect(() => {
    if (cartSuccess) {
      toast.success(cartData?.message || "Added to Cart");
    }

    if (cartError) toast.error(cartData?.message || "Adding failed");
  }, [cartSuccess, cartError]);
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  if (isError) {
    return <h1>Error</h1>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="flex flex-col md:flex-row items-center gap-10 p-6 max-w-6xl mx-auto">
        {/* Product Image */}
        <div className="relative group">
          <img
            src={product.photoUrl || ""}
            alt="Pink T-shirt"
            className="w-[320px] md:w-[400px] rounded-2xl shadow-2xl transition-all duration-300 group-hover:shadow-3xl border border-white/20"
          />
        </div>

        {/* Product Details */}
        <Card className="w-full max-w-xl bg-white/70 backdrop-blur-lg border-white/30 shadow-2xl rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {product.name}
              </h2>
            </div>

            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Rs.{product.price}
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg font-bold text-gray-800">Select Size</p>
              <div className="flex gap-3">
                {sizes.map((size) => {
                  const sizeData = product.sizes.find((s) => s.size === size);
                  const isOutOfStock = !sizeData || sizeData.stock <= 0;

                  return (
                    <div
                      key={size}
                      onClick={() => {
                        if (isOutOfStock) {
                          toast.error(`${size} size is out of stock`);
                        } else {
                          setSelectedSize(size);
                        }
                      }}
                    >
                      <Button
                        variant={selectedSize === size ? "default" : "outline"}
                        disabled={isOutOfStock}
                        className={cn(
                          "w-12 h-12 font-semibold rounded-xl transition-all duration-300 hover:scale-105",
                          isOutOfStock
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                            : selectedSize === size
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                            : "border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        )}
                      >
                        {size}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <Button
                onClick={handleAdd}
                disabled={cartLoading}
                className="w-full text-white h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {cartLoading ? <ButtonLoader /> : " ADD TO CART"}
              </Button>
              <PurchaseWrapper
                productId={productId}
                selectedSize={selectedSize}
                quantity={1}
                mode="single"
              />
            </div>

            <div className="space-y-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 text-sm font-medium text-green-700">
                <span className="text-green-500">✅</span>
                <span>100% Original product.</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-blue-700">
                <span className="text-blue-500">💵</span>
                <span>Cash on delivery is available on this product.</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-purple-700">
                <span className="text-purple-500">🔁</span>
                <span>Easy return and exchange policy within 7 days.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
