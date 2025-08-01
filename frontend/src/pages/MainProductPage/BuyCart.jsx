import React from "react";
import { useInitializeEsewaCartPaymentMutation } from "@/features/Api/purchaseApi";

const BuyCart = ({ onPaymentInitialized }) => {
  const [initializeCartPayment, { isLoading }] =
    useInitializeEsewaCartPaymentMutation();

  const handleBuyCart = async () => {
    try {
      const response = await initializeCartPayment().unwrap();

      if (response.success) {
        // Pass payment data, transaction uuid (orderGroupId), and amount to parent wrapper
        onPaymentInitialized(
          response.payment,
          response.orderGroupId,
          response.amount
        );
      } else {
        alert(response.message || "Failed to initialize cart payment");
      }
    } catch (error) {
      console.error("Cart payment init error:", error);
      alert("Failed to initialize cart payment");
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleBuyCart}
      className="w-full h-12 bg-indigo-600 text-white rounded-xl"
    >
      {isLoading ? "Processing..." : "Buy All in Cart"}
    </button>
  );
};

export default BuyCart;
