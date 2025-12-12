// src/services/AuthService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
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
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Erro ao parsear usuário:', error);
    return null;
  }
};

// Interceptor para adicionar token às requisições
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { access_token, token, user } = response.data;

      // Usa access_token ou token (dependendo da API)
      const tokenToSave = access_token || token;

      if (!tokenToSave || !user) {
        throw new Error('Dados de autenticação inválidos');
      }

      localStorage.setItem(TOKEN_KEY, tokenToSave);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return { success: true, user, token: tokenToSave };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erro no login'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { access_token, token, user } = response.data;

      const tokenToSave = access_token || token;

      if (tokenToSave && user) {
        localStorage.setItem(TOKEN_KEY, tokenToSave);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro no cadastro'
      };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => getUser(),

  isAuthenticated: () => {
    const token = getToken();
    const user = getUser();
    return !!token && !!user;
  },

  getToken: () => getToken(),

  updateUser: (updatedUser) => {
    try {
      const currentUser = getUser();
      const mergedUser = { ...currentUser, ...updatedUser };
      localStorage.setItem(USER_KEY, JSON.stringify(mergedUser));
      return mergedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return null;
    }
  }
};

export default api;