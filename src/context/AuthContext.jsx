// src/context/AuthContext.jsx - VERSÃO FUNCIONAL
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { authService } from "../services/AuthService";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // DEBUG: log ao iniciar
  useEffect(() => {
    console.log("AuthProvider montado");
  }, []);

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Carregando usuário do localStorage...");
        const storedUser = authService.getCurrentUser();
        console.log("Usuário recuperado do localStorage:", storedUser);

        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("Loading finalizado, user:", user);
      }
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (credentials) => {
    try {
      console.log("AuthContext: Tentando login...");
      const result = await authService.login(credentials);

      console.log("AuthContext: Resultado do login:", result);

      if (result.success) {
        // ATUALIZA O ESTADO DO USUÁRIO
        setUser(result.user);
        console.log("AuthContext: Usuário definido:", result.user);
        return { success: true, user: result.user };
      } else {
        console.log("AuthContext: Login falhou:", result.message);
        return {
          success: false,
          message: result.message || "Credenciais inválidas",
        };
      }
    } catch (error) {
      console.error("AuthContext: Erro no login:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  };

  // Função de logout
  const logout = useCallback(() => {
    console.log("AuthContext: Fazendo logout");
    authService.logout();
    setUser(null);
  }, []);

  // Verificar se é admin
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return user.role === "ADMIN";
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAdmin,
    }),
    [user, loading, login, logout, isAdmin]
  );

  // DEBUG: log quando o valor muda
  console.log("AuthContext value atualizado:", {
    user: user ? `${user.nome} (${user.email})` : "null",
    loading,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
