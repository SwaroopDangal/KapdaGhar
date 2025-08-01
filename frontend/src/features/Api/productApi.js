import { backend_url } from "@/server";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PRODUCT_API = `${backend_url}/api/v1/products/`;
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: PRODUCT_API, credentials: "include" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "all",
        method: "GET",
      }),
    }),
    getLatestProducts: builder.query({
      query: () => ({
        url: "latest",
        method: "GET",
      }),
    }),
    getBestSellers: builder.query({
      query: () => ({
        url: "bestsellers",
        method: "GET",
      }),
    }),
    getFeaturedProducts: builder.query({
      query: () => ({
        url: "featuredProducts",
        method: "GET",
      }),
    }),
    getProductById: builder.query({
      query: (productId) => ({
        url: `product/${productId}`,
        method: "GET",
      }),
    }),
    addProduct: builder.mutation({
      query: (inputData) => ({
        url: "add",
        method: "POST",
        body: inputData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${productId}`,
        method: "DELETE",
      }),
    }),
    getSearchAndFilter: builder.query({
      query: ({
        searchQuery = "",
        categories = [],
        types = [],
        sortByPrice = "",
      }) => {
        let queryString = `/collection?query=${encodeURIComponent(
          searchQuery
        )}`;

        if (categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }
        if (types.length > 0) {
          const typeString = types.map(encodeURIComponent).join(",");
          queryString += `&types=${typeString}`;
        }

        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetBestSellersQuery,
  useGetLatestProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useGetFeaturedProductsQuery,
  useGetSearchAndFilterQuery,
  useDeleteProductMutation,
} = productApi;
