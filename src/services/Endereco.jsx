// src/services/EnderecoService.js
import api from "./Api";

class EnderecoService {
  async criarEndereco(idCliente, enderecoData) {
    try {
      const response = await api.post(`/endereco/${idCliente}`, enderecoData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao criar endereço"
      );
    }
  }

  async listarEnderecos() {
    try {
      const userStr = localStorage.getItem("discool_user");
      const user = userStr ? JSON.parse(userStr) : null;
      // Resolve id do cliente a partir de possíveis formatos
      const idCliente =
        user?.idCliente || user?.id || user?.cliente?.idCliente || null;
      if (!idCliente) throw new Error("Usuário não autenticado");

      try {
        const response = await api.get(`/endereco/cliente/${idCliente}`);
        return response.data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          return [];
        }
        throw err;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar endereços"
      );
    }
  }

  async buscarEnderecoPorId(id) {
    try {
      const response = await api.get(`/endereco/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar endereço"
      );
    }
  }

  async atualizarEndereco(id, enderecoData) {
    try {
      const response = await api.patch(`/endereco/${id}`, enderecoData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar endereço"
      );
    }
  }

  async definirComoPadrao(id) {
    try {
      const response = await api.patch(`/endereco/padrao/${id}`, {});
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao definir endereço como padrão"
      );
    }
  }

  async excluirEndereco(id) {
    try {
      await api.delete(`/endereco/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir endereço"
      );
    }
  }
}

export default new EnderecoService();
