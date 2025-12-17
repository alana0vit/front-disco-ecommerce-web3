// src/services/AuthService.js - VERSÃO CORRIGIDA
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Altere para sua API
const TOKEN_KEY = 'discool_token';
const USER_KEY = 'discool_user';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funções auxiliares
const getToken = () => localStorage.getItem(TOKEN_KEY);
const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Decodifica JWT (base64url) de forma segura
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('Falha ao decodificar JWT:', e);
    return null;
  }
};

// Verifica se o token expirou com base no campo exp (segundos)
const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true; // se não tiver exp, considere expirado
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
};

// Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remover Content-Type para FormData (deixe o browser definir automaticamente)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: se 401, faz logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      console.warn('Sessão expirada. Realizando logout automático.');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);

      // DEBUG: Verifique a resposta da API
      console.log('Resposta da API no login:', response.data);

      const { token, access_token, user } = response.data;

      // Usa token ou access_token (depende da API)
      const tokenToSave = token || access_token;

      if (!tokenToSave) {
        throw new Error('Token não encontrado na resposta');
      }

      // SALVA NO LOCALSTORAGE
      localStorage.setItem(TOKEN_KEY, tokenToSave);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      console.log('Token salvo:', tokenToSave.substring(0, 20) + '...');
      console.log('Usuário salvo:', user);

      // Notifica app sobre mudança de autenticação
      try {
        window.dispatchEvent(new Event('auth-changed'));
      } catch { }

      return { success: true, user, token: tokenToSave };
    } catch (error) {
      console.error('Erro no login service:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro no login'
      };
    }
  },

  // Recuperação de senha: solicita email
  forgotPassword: async ({ email }) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return { success: true, message: response.data?.message || 'Se o email existir, enviaremos instruções.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Falha ao solicitar recuperação',
      };
    }
  },

  // Valida token de reset
  validateResetToken: async (token) => {
    try {
      const response = await api.get(`/validate-reset-token/${token}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Token inválido ou expirado' };
    }
  },

  // Redefine senha com token
  resetPassword: async ({ token, novaSenha }) => {
    try {
      const response = await api.post('/reset-password', { token, novaSenha });
      return { success: true, message: response.data?.message || 'Senha redefinida com sucesso' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Não foi possível redefinir a senha',
      };
    }
  },

  register: async (data) => {
    try {
      const response = await api.post('/register', data);

      console.log('Resposta do registro:', response.data);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro no register service:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro no registro'
      };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('Logout realizado - localStorage limpo');
    // Notifica app sobre mudança de autenticação
    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch { }
  },

  getCurrentUser: () => {
    const user = getUser();
    console.log('Usuário recuperado do localStorage:', user);
    return user;
  },

  isAuthenticated: () => {
    const token = getToken();
    const user = getUser();
    const expired = isTokenExpired(token);
    const isAuth = !!token && !!user && !expired;
    console.log(
      'isAuthenticated?', isAuth,
      'Token:', !!token,
      'Expired:', expired,
      'User:', !!user
    );
    return isAuth;
  },

  getToken: () => getToken(),
  isTokenExpired: (token) => isTokenExpired(token),

  // Para debug: verifica localStorage
  debugStorage: () => {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      user: localStorage.getItem(USER_KEY)
    };
  }
};

export default api;