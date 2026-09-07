import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="p-8 text-slate-400">Preparing your workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
