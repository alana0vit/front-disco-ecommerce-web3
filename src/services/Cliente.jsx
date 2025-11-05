// src/services/api.js (adicionar estas funções)
export const clientService = {
  // Criar cliente - POST /cliente
  createClient: async (clientData) => {
    const response = await api.post('/cliente', clientData);
    return response.data;
  },

  // Buscar todos os clientes - GET /cliente
  getAllClients: async () => {
    const response = await api.get('/cliente');
    return response.data;
  },

  // Buscar cliente por ID - GET /cliente/:id
  getClientById: async (id) => {
    const response = await api.get(`/cliente/${id}`);
    return response.data;
  },

  // Atualizar cliente - PATCH /cliente/:id
  updateClient: async (id, clientData) => {
    const response = await api.patch(`/cliente/${id}`, clientData);
    return response.data;
  },

  // Deletar cliente - DELETE /cliente/:id
  deleteClient: async (id) => {
    await api.delete(`/cliente/${id}`);
  }
};