// src/services/CategoriaService.js
import api from "./Api";

class CategoriaService {
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

  async listarCategorias() {
    try {
      const response = await api.get("/categoria");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar categorias"
      );
    }
  }

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

  async excluirCategoria(id) {
    try {
      await api.delete(`/categoria/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir categoria"
      );
    }
  }
}

export default new CategoriaService();
