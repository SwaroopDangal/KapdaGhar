import { backend_url } from "@/server";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CART_API = `${backend_url}/api/v1/cart/`;
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: CART_API, credentials: "include" }),
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: ({ productId, quantity, selectedSize }) => ({
        url: "add",
        method: "POST",
        body: { productId, quantity, selectedSize },
      }),
      invalidatesTags: ["CartCount", "CartInfo"],
    }),
    itemCount: builder.query({
      query: () => ({
        url: "getCount",
        method: "GET",
      }),
      providesTags: ["CartCount"],
    }),
    updateCart: builder.mutation({
      query: ({ productId, quantity, selectedSize }) => ({
        url: "update",
        method: "PUT",
        body: { productId, quantity, selectedSize },
      }),
    }),
    deleteCart: builder.mutation({
      query: ({ productId, selectedSize }) => ({
        url: "delete",
        method: "delete",
        body: { productId, selectedSize },
      }),
      invalidatesTags: ["cartCount"],
    }),
    getCartItems: builder.query({
      query: () => ({
        url: "getItem",
        method: "GET",
      }),
      providesTags: ["CartInfo"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useItemCountQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetCartItemsQuery,
} = cartApi;
