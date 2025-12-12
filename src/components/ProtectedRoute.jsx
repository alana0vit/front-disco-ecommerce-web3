// src/components/ProtectedRoute.jsx - VERSÃO CORRIGIDA
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Redirecionar para home se não for admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
