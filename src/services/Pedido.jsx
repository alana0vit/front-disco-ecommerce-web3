// src/services/Pedido.jsx
import api from "./Api";

const PedidoService = {
  async listarPedidosCliente(idCliente) {
    if (!idCliente) throw new Error("idCliente é obrigatório");
    const { data } = await api.get(`/pedido/lista/${idCliente}`);
    return Array.isArray(data) ? data : [];
  },

  async obterPedido(idPedido) {
    if (!idPedido) throw new Error("idPedido é obrigatório");
    const { data } = await api.get(`/pedido/${idPedido}`);
    return data;
  },

  async atualizarPedido(idPedido, payload) {
    const { data } = await api.patch(`/pedido/${idPedido}`, payload);
    return data;
  },
};

export default PedidoService;
