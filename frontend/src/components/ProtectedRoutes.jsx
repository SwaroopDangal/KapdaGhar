import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  console.log("user", user);
  // Still fetching user OR user object is not available yet
  if (isAuthenticated && !user) {
    return <LoadingSpinner />; // or any fallback while user loads
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};
