import React, { useState } from "react";
import BuyProduct from "./BuyProduct";
import BuyCart from "./BuyCart";
import EsewaPaymentForm from "@/components/EsewaPaymentForm";

const PurchaseWrapper = ({ mode, productId, selectedSize, quantity }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [amount, setAmount] = useState(null);
  const [transactionUuid, setTransactionUuid] = useState(null);

  const handlePaymentInit = (payment, uuid, price) => {
    setPaymentData(payment);
    setTransactionUuid(uuid);
    setAmount(price);
  };

  return (
    <>
      {!paymentData ? (
        mode === "single" ? (
          <BuyProduct
            productId={productId}
            selectedSize={selectedSize}
            quantity={quantity}
            onPaymentInitialized={handlePaymentInit}
          />
        ) : (
          <BuyCart onPaymentInitialized={handlePaymentInit} />
        )
      ) : (
        <EsewaPaymentForm
          paymentData={paymentData}
          amount={amount}
          transaction_uuid={transactionUuid}
        />
      )}
    </>
  );
};

export default PurchaseWrapper;
