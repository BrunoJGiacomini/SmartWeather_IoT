import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAuth;