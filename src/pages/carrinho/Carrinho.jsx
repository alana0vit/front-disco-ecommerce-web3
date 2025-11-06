// src/components/Carrinho.jsx
import { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import carrinhoService from "../../services/Carrinho";
import api from "../../services/Api";

const Carrinho = ({ isOpen, onClose, onCheckout }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCarrinho(carrinhoService.getCarrinhoFromStorage());
    }
  }, [isOpen]);

  const atualizarQuantidade = (idProduto, novaQuantidade) => {
    if (novaQuantidade < 1) return;

    const item = carrinho.find((item) => item.produto.idProduto === idProduto);
    if (item && novaQuantidade > item.produto.estoque) {
      alert("Quantidade solicitada maior que o estoque disponível");
      return;
    }

    const novoCarrinho = carrinhoService.atualizarQuantidade(
      idProduto,
      novaQuantidade
    );
    setCarrinho([...novoCarrinho]);
  };

  const removerItem = (idProduto) => {
    const novoCarrinho = carrinhoService.removerItem(idProduto);
    setCarrinho([...novoCarrinho]);
  };

  const finalizarPedido = async () => {
    if (carrinho.length === 0) return;

    setLoading(true);
    try {
      // 1. Criar o pedido
      const pedidoData = {
        valorTotal: carrinhoService.getTotal(),
        qtdTotal: carrinhoService.getQuantidadeTotal(),
        descricao: `Pedido com ${carrinho.length} itens`,
        id_cliente_pdd: 1, // Isso virá do usuário logado
        id_endereco_pdd: 1, // Endereço do usuário
        itemPedidos: carrinho.map((item) => ({
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorUnitario * item.quantidade,
          id_produto_itpdd: item.produto.idProduto,
        })),
      };

      const pedidoResponse = await api.post("/pedido", pedidoData);
      const pedido = pedidoResponse.data;

      // 2. Chamar o callback para ir para o checkout/pagamento
      onCheckout(pedido);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Meu Carrinho</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Itens */}
          <div className="flex-1 overflow-y-auto p-4">
            {carrinho.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Seu carrinho está vazio</p>
              </div>
            ) : (
              carrinho.map((item) => (
                <div
                  key={item.produto.idProduto}
                  className="flex items-center space-x-4 py-4 border-b"
                >
                  <img
                    src={item.produto.imagem}
                    alt={item.produto.nome}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{item.produto.nome}</h3>
                    <p className="text-purple-600 font-semibold">
                      R$ {item.valorUnitario.toFixed(2)}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() =>
                          atualizarQuantidade(
                            item.produto.idProduto,
                            item.quantidade - 1
                          )
                        }
                        className="p-1 rounded border"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>

                      <span className="px-3 py-1 border rounded">
                        {item.quantidade}
                      </span>

                      <button
                        onClick={() =>
                          atualizarQuantidade(
                            item.produto.idProduto,
                            item.quantidade + 1
                          )
                        }
                        disabled={item.quantidade >= item.produto.estoque}
                        className="p-1 rounded border disabled:opacity-50"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removerItem(item.produto.idProduto)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {carrinho.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>R$ {carrinhoService.getTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={finalizarPedido}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Processando..." : "Finalizar Pedido"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
