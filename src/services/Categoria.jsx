// src/services/CategoriaService.js - VERSÃO COM ROTAS PÚBLICAS
import api from "./AuthService";

class CategoriaService {
  // Criar categoria - APENAS ADMIN
  async criarCategoria(categoriaData) {
    try {
      const response = await api.post("/categoria", categoriaData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao criar categoria"
      );
    }
  }

  // Listar categorias - ROTA PÚBLICA
  async listarCategorias() {
    try {
      // Primeiro tenta a rota pública
      const response = await api.get("/categoria/public");
      return response.data;
    } catch (error) {
      console.error("Erro na rota pública de categorias:", error);
      // Fallback: tenta rota protegida
      try {
        const response = await api.get("/categoria");
        return response.data;
      } catch (fallbackError) {
        console.error("Erro também na rota protegida:", fallbackError);
        // Retorna array vazio para não quebrar a aplicação
        return [];
      }
    }
  }

  // Buscar categoria por ID
  async buscarCategoriaPorId(id) {
    try {
      const response = await api.get(`/categoria/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar categoria"
      );
    }
  }

  // Atualizar categoria - APENAS ADMIN
  async atualizarCategoria(id, categoriaData) {
    try {
      const response = await api.patch(`/categoria/${id}`, categoriaData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar categoria"
      );
    }
  }

  // Excluir categoria - APENAS ADMIN
  async excluirCategoria(id) {
    try {
      await api.delete(`/categoria/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir categoria"
      );
    }
  }

  // MÉTODO NOVO: Buscar top categorias (as 5 com mais produtos)
  async listarTopCategorias() {
    try {
      const categorias = await this.listarCategorias();

      if (!categorias || categorias.length === 0) {
        return [];
      }

      // Para contar produtos por categoria, precisamos dos produtos também
      try {
        // Importa o produto service dinamicamente para evitar dependência circular
        const { productService } = await import("./Produto");
        const produtos = await productService.getAllProducts();

        // Contar produtos por categoria
        const contagemPorCategoria = {};
        produtos.forEach((produto) => {
          if (produto.categoria && produto.categoria.nome) {
            const nomeCategoria = produto.categoria.nome;
            contagemPorCategoria[nomeCategoria] =
              (contagemPorCategoria[nomeCategoria] || 0) + 1;
          }
        });

        // Adicionar contagem às categorias
        const categoriasComContagem = categorias.map((categoria) => ({
          id: categoria.idCategoria,
          nome: categoria.nome,
          descricao: categoria.descricao || "",
          quantidadeProdutos: contagemPorCategoria[categoria.nome] || 0,
        }));

        // Ordenar por quantidade de produtos (maior para menor)
        return categoriasComContagem
          .sort((a, b) => b.quantidadeProdutos - a.quantidadeProdutos)
          .slice(0, 5);
      } catch (produtoError) {
        console.error("Erro ao buscar produtos para contagem:", produtoError);
        // Se não conseguir produtos, retorna as primeiras 5 categorias
        return categorias.slice(0, 5).map((cat) => ({
          ...cat,
          quantidadeProdutos: 0,
        }));
      }
    } catch (error) {
      console.error("Erro ao listar top categorias:", error);
      return [];
    }
  }
}

export default new CategoriaService();
