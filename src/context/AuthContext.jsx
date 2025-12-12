// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/AuthService";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = authService.getCurrentUser();
        setUser(storedUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login
  const login = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Verificar se é admin - FUNÇÃO QUE RETORNA BOOLEANO
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return user.role === "ADMIN" || user.isAdmin === true;
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin, // ← FUNÇÃO, não booleano direto
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
