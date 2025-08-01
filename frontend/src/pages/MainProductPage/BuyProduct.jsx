import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useInitializeEsewaPaymentMutation } from "@/features/Api/purchaseApi";

const BuyProduct = ({
  productId,
  onPaymentInitialized,
  selectedSize,
  quantity,
}) => {
  const [
    initializeEsewaPayment,
    { data, isLoading, isSuccess, isError, error },
  ] = useInitializeEsewaPaymentMutation();

  const purchaseHandler = async () => {
    await initializeEsewaPayment({ productId, selectedSize, quantity });
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.payment) {
        onPaymentInitialized(data.payment, data.purchaseId, data.amount);
      } else {
        toast.error("Invalid response from server.");
      }
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to initialize payment");
    }
  }, [data, isSuccess, isError, error, onPaymentInitialized]);

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseHandler}
      className="w-full text-white h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase"
      )}
    </Button>
  );
};

export default BuyProduct;
