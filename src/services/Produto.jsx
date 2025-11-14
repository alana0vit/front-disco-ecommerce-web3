// src/services/Produto.jsx - VERSÃO CORRIGIDA E MELHORADA
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Instância única para todas as requisições
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar headers automaticamente
api.interceptors.request.use(
  (config) => {
    // Se for FormData, não definir Content-Type (deixa o browser definir)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productService = {
  // Buscar todos os produtos - GET /produto
  getAllProducts: async () => {
    try {
      const response = await api.get("/produto");
      console.log("Produtos carregados da API:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      throw error;
    }
  },

  // Buscar produto por ID - GET /produto/:id
  getProductById: async (id) => {
    try {
      const response = await api.get(`/produto/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao carregar produto ${id}:`, error);
      throw error;
    }
  },

  // Filtrar produtos - GET /produto/filtro?nome=&categoria=&precoMin=&precoMax=
  filterProducts: async (filters) => {
    try {
      const params = new URLSearchParams();

      if (filters.nome) params.append("nome", filters.nome);
      if (filters.categoria) params.append("categoria", filters.categoria);
      if (filters.precoMin) params.append("precoMin", filters.precoMin);
      if (filters.precoMax) params.append("precoMax", filters.precoMax);

      const response = await api.get(`/produto/filtro?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao filtrar produtos:", error);
      throw error;
    }
  },

  // Criar produto COM UPLOAD - POST /produto (usando FormData)
  createProduct: async (formData) => {
    try {
      const response = await api.post("/produto", formData);
      console.log("Produto criado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  // Atualizar produto - PATCH /produto/:id (suporta FormData e JSON)
  updateProduct: async (id, productData) => {
    try {
      // Se for FormData, usar multipart, senão JSON normal
      const config =
        productData instanceof FormData
          ? {}
          : { headers: { "Content-Type": "application/json" } };

      const response = await api.patch(`/produto/${id}`, productData, config);
      console.log("Produto atualizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  // Deletar produto - DELETE /produto/:id
  deleteProduct: async (id) => {
    try {
      await api.delete(`/produto/${id}`);
      console.log(`Produto ${id} deletado com sucesso`);
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  // Ativar/Desativar produto - NOVO MÉTODO
  toggleProductStatus: async (id, status) => {
    try {
      const response = await api.patch(`/produto/${id}`, { ativo: status });
      return response.data;
    } catch (error) {
      console.error(`Erro ao alterar status do produto ${id}:`, error);
      throw error;
    }
  },
};

export const categoryService = {
  // Buscar todas as categorias
  getCategories: async () => {
    try {
      const response = await api.get("/categoria");
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      throw error;
    }
  },

  // Buscar categoria por ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categoria/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao carregar categoria ${id}:`, error);
      throw error;
    }
  },

  // Criar categoria
  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/categoria", categoryData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
  },

  // Atualizar categoria
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.patch(`/categoria/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar categoria ${id}:`, error);
      throw error;
    }
  },

  // Deletar categoria
  deleteCategory: async (id) => {
    try {
      await api.delete(`/categoria/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar categoria ${id}:`, error);
      throw error;
    }
  },
};

// Função auxiliar para debug - verifica a estrutura dos produtos
export const debugProducts = (products) => {
  console.log("=== DEBUG PRODUTOS ===");
  console.log("Total de produtos:", products.length);

  products.forEach((product, index) => {
    console.log(`Produto ${index + 1}:`, {
      id: product.idProduto,
      nome: product.nome,
      ativo: product.ativo,
      tipoAtivo: typeof product.ativo,
      categoria: product.categoria,
      estoque: product.estoque,
      preco: product.preco,
    });
  });

  const ativos = products.filter((p) => p.ativo === true || p.ativo === 1);
  const inativos = products.filter((p) => p.ativo === false || p.ativo === 0);

  console.log("Produtos ativos:", ativos.length);
  console.log("Produtos inativos:", inativos.length);
  console.log("=== FIM DEBUG ===");
};

export default api;