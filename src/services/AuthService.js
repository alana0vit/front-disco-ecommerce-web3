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

// Interceptor
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

      return { success: true, user, token: tokenToSave };
    } catch (error) {
      console.error('Erro no login service:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro no login'
      };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('Logout realizado - localStorage limpo');
  },

  getCurrentUser: () => {
    const user = getUser();
    console.log('Usuário recuperado do localStorage:', user);
    return user;
  },

  isAuthenticated: () => {
    const token = getToken();
    const user = getUser();
    const isAuth = !!token && !!user;
    console.log('isAuthenticated?', isAuth, 'Token:', !!token, 'User:', !!user);
    return isAuth;
  },

  getToken: () => getToken(),

  // Para debug: verifica localStorage
  debugStorage: () => {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      user: localStorage.getItem(USER_KEY)
    };
  }
};

export default api;