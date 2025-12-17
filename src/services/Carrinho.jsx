// src/services/carrinhoService.js
import api from "./AuthService";

class CarrinhoService {
  // ==== CARRINHO (protegido) ====
  async getCarrinho(idCliente) {
    try {
      const response = await api.get(`/carrinho/${idCliente}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter carrinho:", error);
      throw new Error(
        error.response?.data?.message || "Erro ao obter carrinho"
      );
    }
  }

  async addItem(idCliente, { id_produto, quantidade }) {
    try {
      const response = await api.post(`/carrinho/${idCliente}/add`, {
        id_produto,
        quantidade,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      throw new Error(
        error.response?.data?.message || "Erro ao adicionar item"
      );
    }
  }

  async updateItem(idCliente, idItem, { quantidade }) {
    try {
      const response = await api.patch(
        `/carrinho/${idCliente}/update/${idItem}`,
        { quantidade }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar item"
      );
    }
  }

  async removeItem(idCliente, idItem) {
    try {
      const response = await api.delete(
        `/carrinho/${idCliente}/remove/${idItem}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      throw new Error(error.response?.data?.message || "Erro ao remover item");
    }
  }

  // Sincroniza os itens do carrinho local com o carrinho do backend do cliente
  async syncLocalCartToBackend(idCliente, localItems = []) {
    const carrinho = await this.getCarrinho(idCliente);
    const itensAtuais = Array.isArray(carrinho?.itens) ? carrinho.itens : [];

    for (const itemLocal of localItems) {
      const existente = itensAtuais.find(
        (i) => i.produto?.idProduto === itemLocal.id
      );

      const quantidadeDesejada = itemLocal.quantidade ?? 1;
      if (existente) {
        if (existente.quantidade !== quantidadeDesejada) {
          await this.updateItem(idCliente, existente.idItem, {
            quantidade: quantidadeDesejada,
          });
        }
      } else {
        await this.addItem(idCliente, {
          id_produto: itemLocal.id,
          quantidade: quantidadeDesejada,
        });
      }
    }

    return await this.getCarrinho(idCliente);
  }

  // ==== PEDIDO (protegido) ====
  async criarPedido(pedidoData, idCarrinho) {
    try {
      const response = await api.post(`/pedido/${idCarrinho}`, pedidoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw new Error(error.response?.data?.message || "Erro ao criar pedido");
    }
  }

  // Buscar pedido específico
  async buscarPedido(idPedido) {
    try {
      const response = await api.get(`/pedido/${idPedido}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar pedido");
    }
  }

  // Criar pagamento
  async criarPagamento(pagamentoData) {
    try {
      const response = await api.post("/pagamento", pagamentoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      throw new Error(
        error.response?.data?.message || "Erro ao criar pagamento"
      );
    }
  }

  // Atualizar status do pagamento
  async atualizarPagamento(idPagamento, statusData) {
    try {
      const response = await api.patch(`/pagamento/${idPagamento}`, statusData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      throw new Error(
        error.response?.data?.message || "Erro ao atualizar pagamento"
      );
    }
  }

  // Verificar estoque dos produtos
  async verificarEstoque(itensCarrinho) {
    try {
      // Para cada item, verificar se há estoque suficiente
      const verificacoes = itensCarrinho.map(async (item) => {
        try {
          let produtoResp;
          try {
            produtoResp = await api.get(`/produto/public/${item.id}`);
          } catch {
            produtoResp = await api.get(`/produto/${item.id}`);
          }
          const produto = produtoResp.data;

          const available =
            produto.estoqueDisponivel ??
            Math.max(
              0,
              (produto.estoqueTotal ?? produto.estoque ?? 0) -
                (produto.estoqueReservado ?? 0)
            );

          if (available < item.quantidade) {
            return {
              produto: produto.nome,
              estoqueDisponivel: available,
              quantidadeSolicitada: item.quantidade,
              disponivel: false,
            };
          }

          return {
            produto: produto.nome,
            estoqueDisponivel: available,
            quantidadeSolicitada: item.quantidade,
            disponivel: true,
          };
        } catch (error) {
          return {
            produto: `ID: ${item.id}`,
            estoqueDisponivel: 0,
            quantidadeSolicitada: item.quantidade,
            disponivel: false,
            erro: "Produto não encontrado",
          };
        }
      });

      const resultados = await Promise.all(verificacoes);
      return resultados;
    } catch (error) {
      console.error("Erro ao verificar estoque:", error);
      throw new Error("Erro ao verificar estoque");
    }
  }

  // Buscar informações do cliente (para pedido)
  async buscarClienteParaPedido() {
    // Como não tem login, vamos usar um cliente padrão ou pedir informações
    // Retornando um cliente padrão para demonstração
    return {
      idCliente: 1, // Cliente padrão para pedidos sem login
      nome: "Cliente Visitante",
    };
  }

  // Buscar endereço padrão (para pedido)
  async buscarEnderecoParaPedido() {
    // Endereço padrão para pedidos sem login
    return {
      idEndereco: 1, // Endereço padrão
      rua: "Avenida Principal",
      numero: "123",
      cidade: "São Paulo",
      estado: "SP",
    };
  }

  // Calcular frete (simulação)
  async calcularFrete(cep, itens) {
    try {
      // Simulação de cálculo de frete
      const pesoTotal = itens.length * 0.5; // kg estimado por item
      const valorTotal = itens.reduce(
        (total, item) => total + item.price * item.quantidade,
        0
      );

      // Simulação de diferentes opções de frete
      const opcoesFrete = [
        {
          nome: "Econômica",
          prazo: "10-15 dias",
          valor: Math.max(15, valorTotal * 0.05),
          id: "economica",
        },
        {
          nome: "Padrão",
          prazo: "5-8 dias",
          valor: Math.max(20, valorTotal * 0.08),
          id: "padrao",
        },
        {
          nome: "Expressa",
          prazo: "2-3 dias",
          valor: Math.max(30, valorTotal * 0.12),
          id: "expressa",
        },
      ];

      return opcoesFrete;
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      throw new Error("Erro ao calcular frete");
    }
  }

  // Validar cupom de desconto (simulação)
  async validarCupom(codigoCupom, valorTotal) {
    try {
      // Simulação de validação de cupom
      const cuponsValidos = {
        DISCOOL10: { tipo: "percentual", valor: 10, minCompra: 50 },
        DISCOOL20: { tipo: "percentual", valor: 20, minCompra: 100 },
        FRETEGRATIS: { tipo: "frete_gratis", valor: 0, minCompra: 150 },
        PRIMEIRACOMPRA: { tipo: "fixo", valor: 25, minCompra: 0 },
      };

      const cupom = cuponsValidos[codigoCupom.toUpperCase()];

      if (!cupom) {
        throw new Error("Cupom inválido ou expirado");
      }

      if (valorTotal < cupom.minCompra) {
        throw new Error(
          `Valor mínimo para este cupom: R$ ${cupom.minCompra.toFixed(2)}`
        );
      }

      return cupom;
    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      throw new Error(error.message || "Erro ao validar cupom");
    }
  }

  // Buscar produto por ID (preferindo público)
  async buscarProduto(idProduto) {
    try {
      try {
        const response = await api.get(`/produto/public/${idProduto}`);
        return response.data;
      } catch {
        const response = await api.get(`/produto/${idProduto}`);
        return response.data;
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw new Error("Produto não encontrado");
    }
  }
}

export default new CarrinhoService();
