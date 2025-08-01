import { backend_url } from "@/server";
import React, { useEffect } from "react";

const EsewaPaymentForm = ({ paymentData, amount, transaction_uuid }) => {
  const productCode = import.meta.env.VITE_ESEWA_PRODUCT_CODE;
  const esewaGatewayUrl = import.meta.env.VITE_ESEWA_GATEWAY_URL;

  const { signature, signed_field_names } = paymentData || {};

  console.log("transaction_uuid in EsewaPaymentForm:", transaction_uuid);
  console.log("productCode:", productCode);
  console.log("esewaGatewayUrl:", esewaGatewayUrl);

  useEffect(() => {
    // Automatically submit the form when component mounts
    const form = document.getElementById("esewaPaymentForm");
    if (form) form.submit();
  }, []);

  return (
    <form
      id="esewaPaymentForm"
      action={`${esewaGatewayUrl}/api/epay/main/v2/form`}
      method="POST"
    >
      <input type="hidden" name="amount" value={amount} required />
      <input type="hidden" name="tax_amount" value="0" required />
      <input type="hidden" name="total_amount" value={amount} required />
      <input
        type="hidden"
        name="transaction_uuid"
        value={transaction_uuid}
        required
      />
      <input type="hidden" name="product_code" value={productCode} required />
      <input type="hidden" name="product_service_charge" value="0" required />
      <input type="hidden" name="product_delivery_charge" value="0" required />

      {/* Keep these static as per your request */}
      <input
        type="hidden"
        name="success_url"
        value={`${backend_url}/api/v1/purchase/esewa/complete-payment`}
        required
      />
      <input
        type="hidden"
        name="failure_url"
        value="https://developer.esewa.com.np/failure"
        required
      />

      <input
        type="hidden"
        name="signed_field_names"
        value={signed_field_names}
        required
      />
      <input type="hidden" name="signature" value={signature} required />

      <noscript>
        <input value="Pay with eSewa" type="submit" />
      </noscript>
    </form>
  );
};

export default EsewaPaymentForm;
