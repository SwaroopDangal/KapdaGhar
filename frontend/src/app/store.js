import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/Api/authApi.js";
import { productApi } from "@/features/Api/productApi.js";
import { cartApi } from "@/features/Api/cartApi.js";
import { purchaseApi } from "@/features/Api/purchaseApi.js";
import { userLoggedIn } from "@/features/AuthSlice.js";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      purchaseApi.middleware
    ),
});
const initializeApp = async () => {
  const result = await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );

  if (result.data) {
    appStore.dispatch(userLoggedIn({ user: result.data }));
  }
};

initializeApp();
