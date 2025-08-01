import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice.js";
import { authApi } from "@/features/Api/authApi";
import { productApi } from "@/features/Api/productApi.js";
import { cartApi } from "@/features/Api/cartApi.js";
import { purchaseApi } from "@/features/Api/purchaseApi.js";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,

  auth: authReducer,
});

export default rootReducer;
