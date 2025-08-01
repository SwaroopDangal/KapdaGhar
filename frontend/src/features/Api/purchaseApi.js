import { backend_url } from "@/server";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = `${backend_url}/api/v1/purchase/`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    initializeEsewaPayment: builder.mutation({
      query: ({ productId, selectedSize, quantity }) => ({
        url: "/esewa/initialize",
        method: "POST",
        body: { productId, selectedSize, quantity },
      }),
    }),
    initializeEsewaCartPayment: builder.mutation({
      query: () => ({
        url: "/esewa/cart/initialize",
        method: "POST",
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "orders",
        method: "GET",
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/my-orders",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
    updateDeliveryStatus: builder.mutation({
      query: ({ status, purchaseId }) => ({
        url: "change-delivery-status",
        method: "PUT",
        body: { status, purchaseId },
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useInitializeEsewaPaymentMutation,
  useInitializeEsewaCartPaymentMutation,
  useGetAllOrdersQuery,
  useUpdateDeliveryStatusMutation,
  useGetMyOrdersQuery,
} = purchaseApi;
