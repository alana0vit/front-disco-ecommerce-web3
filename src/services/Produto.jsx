// src/services/Produto.jsx - VERSÃO COM ROTAS PÚBLICAS
import api from "./AuthService";

export const productService = {
  // ========== ROTAS PÚBLICAS (SEM AUTENTICAÇÃO) ==========

  // Buscar todos os produtos - GET /produto/public
  getAllProducts: async () => {
    try {
      const response = await api.get("/produto/public");
      console.log("Produtos carregados (público):", response.data.length);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      // Fallback: tenta rota protegida se a pública falhar
      try {
        const response = await api.get("/produto");
        return response.data;
      } catch (fallbackError) {
        console.error("Fallback também falhou:", fallbackError);
        return []; // Retorna array vazio para não quebrar a aplicação
      }
    }
  },

  // Buscar produto por ID - GET /produto/public/:id
  getProductById: async (id) => {
    try {
      const response = await api.get(`/produto/public/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao carregar produto ${id} (público):`, error);
      // Fallback: tenta rota protegida
      try {
        const response = await api.get(`/produto/${id}`);
        return response.data;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  },

  // Filtrar produtos - GET /produto/public/filtro?...
  filterProducts: async (filters) => {
    try {
      const params = new URLSearchParams();

      if (filters.nome) params.append("nome", filters.nome);
      if (filters.categoria) params.append("categoria", filters.categoria);
      if (filters.precoMin) params.append("precoMin", filters.precoMin);
      if (filters.precoMax) params.append("precoMax", filters.precoMax);

      const response = await api.get(
        `/produto/public/filtro?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao filtrar produtos (público):", error);
      // Fallback: tenta rota protegida
      try {
        const params = new URLSearchParams();
        if (filters.nome) params.append("nome", filters.nome);
        if (filters.categoria) params.append("categoria", filters.categoria);
        if (filters.precoMin) params.append("precoMin", filters.precoMin);
        if (filters.precoMax) params.append("precoMax", filters.precoMax);

        const response = await api.get(`/produto/filtro?${params.toString()}`);
        return response.data;
      } catch (fallbackError) {
        return []; // Retorna array vazio
      }
    }
  },

  // ========== ROTAS PROTEGIDAS (COM AUTENTICAÇÃO) ==========

  // Criar produto COM UPLOAD - POST /produto (usando FormData) - APENAS ADMIN
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

  // Atualizar produto - PATCH /produto/:id (suporta FormData e JSON) - APENAS ADMIN
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

  // Deletar produto - DELETE /produto/:id - APENAS ADMIN
  deleteProduct: async (id) => {
    try {
      await api.delete(`/produto/${id}`);
      console.log(`Produto ${id} deletado com sucesso`);
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  // Ativar/Desativar produto - APENAS ADMIN
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
  // ========== ROTAS PÚBLICAS (SEM AUTENTICAÇÃO) ==========

  // Buscar todas as categorias - GET /categoria/public
  getCategories: async () => {
    try {
      const response = await api.get("/categoria/public");
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar categorias (público):", error);
      // Fallback: tenta rota protegida
      try {
        const response = await api.get("/categoria");
        return response.data;
      } catch (fallbackError) {
        return []; // Retorna array vazio
      }
    }
  },

  // ========== ROTAS PROTEGIDAS (COM AUTENTICAÇÃO) ==========

  // Buscar categoria por ID - GET /categoria/:id
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categoria/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao carregar categoria ${id}:`, error);
      throw error;
    }
  },

  // Criar categoria - POST /categoria - APENAS ADMIN
  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/categoria", categoryData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
  },

  // Atualizar categoria - PATCH /categoria/:id - APENAS ADMIN
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.patch(`/categoria/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar categoria ${id}:`, error);
      throw error;
    }
  },

  // Deletar categoria - DELETE /categoria/:id - APENAS ADMIN
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
