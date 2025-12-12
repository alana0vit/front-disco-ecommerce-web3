// src/services/EnderecoService.js
import api from "./AuthService";

class EnderecoService {
  async criarEndereco(idCliente, enderecoData) {
    try {
      const response = await api.post(`/endereco/${idCliente}`, enderecoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar endereço');
    }
  }

  async listarEnderecos() {
    try {
      const response = await api.get('/endereco');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar endereços');
    }
  }

  async buscarEnderecoPorId(id) {
    try {
      const response = await api.get(`/endereco/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar endereço');
    }
  }

  async atualizarEndereco(id, enderecoData) {
    try {
      const response = await api.patch(`/endereco/${id}`, enderecoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar endereço');
    }
  }

  async definirComoPadrao(id) {
    try {
      const response = await api.patch(`/endereco/padrao/${id}`, {});
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao definir endereço como padrão');
    }
  }

  async excluirEndereco(id) {
    try {
      await api.delete(`/endereco/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir endereço');
    }
  }
}

export default new EnderecoService();