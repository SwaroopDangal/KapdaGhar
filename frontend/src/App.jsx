import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import AboutUs from "./pages/About/About";
import ContactUs from "./pages/contact/Contact";
import Hero from "./pages/Hero/Hero";
import AdminPanel from "./pages/Admin/AdminPanel";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import ProductMain from "./pages/MainProductPage/ProductMain";
import CartPage from "./pages/CartPage/CartPage";
import MyOrderPage from "./pages/MyOrders/MyOrderPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import NotFoundPage from "./components/NotFoundPage";

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Hero />,
        },
        {
          path: "login",
          element: (
            <AuthenticatedUser>
              <LoginPage />
            </AuthenticatedUser>
          ),
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "collection",
          element: <CollectionsPage />,
        },
        {
          path: "about",
          element: <AboutUs />,
        },
        {
          path: "contact",
          element: <ContactUs />,
        },
        {
          path: "product/:productId",
          element: (
            <ProtectedRoute>
              <ProductMain />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin",
          element: (
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "my-orders",
          element: (
            <ProtectedRoute>
              <MyOrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
