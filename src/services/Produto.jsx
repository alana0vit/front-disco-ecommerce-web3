// src/services/Produto.jsx - VERSÃO CORRIGIDA
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Instância para requisições normais (JSON)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instância separada para uploads (sem Content-Type fixo)
const apiUpload = axios.create({
  baseURL: API_BASE_URL,
  // Não definir Content-Type - o browser vai definir automaticamente como multipart/form-data
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

apiUpload.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Upload API Error:', error);
    return Promise.reject(error);
  }
);

export const productService = {
  // Buscar todos os produtos - GET /produto
  getAllProducts: async () => {
    const response = await api.get('/produto');
    return response.data;
  },

  // Buscar produto por ID - GET /produto/:id
  getProductById: async (id) => {
    const response = await api.get(`/produto/${id}`);
    return response.data;
  },

  // Filtrar produtos - GET /produto/filtro?nome=&categoria=&precoMin=&precoMax=
  filterProducts: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.nome) params.append('nome', filters.nome);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.precoMin) params.append('precoMin', filters.precoMin);
    if (filters.precoMax) params.append('precoMax', filters.precoMax);
    
    const response = await api.get(`/produto/filtro?${params.toString()}`);
    return response.data;
  },

  // Criar produto COM UPLOAD - POST /produto (usando FormData)
  createProduct: async (formData) => {
    const response = await apiUpload.post('/produto', formData, {
      headers: {
        // O browser vai definir automaticamente o Content-Type como multipart/form-data
        // com o boundary correto quando usamos FormData
      }
    });
    return response.data;
  },

  // Atualizar produto - PATCH /produto/:id (mantém JSON)
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/produto/${id}`, productData);
    return response.data;
  },

  // Deletar produto - DELETE /produto/:id
  deleteProduct: async (id) => {
    await api.delete(`/produto/${id}`);
  }
};

export const categoryService = {
  // Buscar todas as categorias
  getCategories: async () => {
    const response = await api.get('/categoria');
    return response.data;
  },

  // Buscar categoria por ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categoria/${id}`);
    return response.data;
  }
};

export default api;