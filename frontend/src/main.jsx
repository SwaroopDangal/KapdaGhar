import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider, useDispatch } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import LoadingSpinner from "./components/LoadingSpinner";
import { useLoadUserQuery } from "./features/Api/authApi";
import { setLoadingFinished, userLoggedIn } from "./features/AuthSlice";

const Custom = ({ children }) => {
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError } = useLoadUserQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(userLoggedIn({ user: data }));
    } else if (isError) {
      dispatch(setLoadingFinished());
    }
  }, [isSuccess, isError, data, dispatch]);

  return <>{isLoading ? <LoadingSpinner /> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
      </Custom>

      <Toaster />
    </Provider>
  </StrictMode>
);
