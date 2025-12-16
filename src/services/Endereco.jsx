// src/services/EnderecoService.js
import api from "./AuthService";

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
      // Preferir rota por cliente quando disponível
      const userStr = localStorage.getItem("discool_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.idCliente) {
        try {
          const response = await api.get(`/endereco/cliente/${user.idCliente}`);
          return response.data;
        } catch (err) {
          // Fallback para lista geral em caso de erro específico
          console.warn(
            "Falha na rota por cliente, usando fallback /endereco",
            err?.response?.status
          );
          const response = await api.get("/endereco");
          // Filtra client-side como fallback
          const data = Array.isArray(response.data) ? response.data : [];
          return data.filter((e) => e?.cliente?.idCliente === user.idCliente);
        }
      } else {
        const response = await api.get("/endereco");
        return response.data;
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
