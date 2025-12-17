// src/pages/checkout/Checkout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import carrinhoService from "../../services/Carrinho";
import EnderecoService from "../../services/Endereco";
import {
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itens, getTotalItens, getTotalPreco, limparCarrinho } = useCarrinho();

  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState(null);
  const [opcoesFrete, setOpcoesFrete] = useState([]);
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [frete, setFrete] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = getTotalPreco();
  const totalItens = getTotalItens();
  const total = subtotal + frete;

  useEffect(() => {
    (async () => {
      try {
        const list = await EnderecoService.listarEnderecos();
        setEnderecos(list);
        const padrao = list?.find?.((e) => e.padrao) || list?.[0];
        if (padrao) setEnderecoSelecionadoId(padrao.idEndereco || padrao.id);
      } catch (e) {
        setEnderecos([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!enderecoSelecionadoId || itens.length === 0) return;
    (async () => {
      try {
        const enderecoSel = enderecos.find(
          (e) => (e.idEndereco || e.id) === enderecoSelecionadoId
        );
        const cep = enderecoSel?.cep || "00000000";
        const opcoes = await carrinhoService.calcularFrete(cep, itens);
        setOpcoesFrete(opcoes);
        if (opcoes?.length) {
          setFreteSelecionado(opcoes[0].id);
          setFrete(opcoes[0].valor);
        }
      } catch (e) {
        console.warn("Falha ao calcular frete", e);
      }
    })();
  }, [enderecoSelecionadoId, itens]);

  const handleFreteChange = (id) => {
    setFreteSelecionado(id);
    const opcao = opcoesFrete.find((o) => o.id === id);
    if (opcao) setFrete(opcao.valor);
  };

  const finalizar = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) {
        navigate("/login");
        return;
      }
      const idCliente = user.idCliente || user.id || user.cliente?.idCliente;
      if (!idCliente) throw new Error("Cliente não identificado");
      const carrinhoAtual = await carrinhoService.syncLocalCartToBackend(
        idCliente,
        itens
      );
      const enderecoSel = enderecos.find(
        (e) => (e.idEndereco || e.id) === enderecoSelecionadoId
      );
      if (!enderecoSel) throw new Error("Selecione um endereço");
      const idEndereco = enderecoSel.idEndereco || enderecoSel.id;

      const pedidoData = {
        id_cliente: idCliente,
        id_endereco: idEndereco,
        descricao: `Pedido Discool - ${new Date().toLocaleString()}`,
      };
      const pedidoCriado = await carrinhoService.criarPedido(
        pedidoData,
        carrinhoAtual.idCarrinho
      );

      limparCarrinho();
      navigate(`/pagamento/${pedidoCriado.idPedido}`, {
        state: {
          pedido: pedidoCriado,
          total: Number(pedidoCriado.valorTotal || total),
        },
      });
    } catch (e) {
      setError(e.message || "Erro ao finalizar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (totalItens === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <button
            onClick={() => navigate("/produtos")}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar às compras
          </button>
          <div className="bg-white rounded-xl p-8 text-center shadow">
            Seu carrinho está vazio.
          </div>
        </div>
      </div>
    );
  }

  const cepSelecionado = enderecos.find(
    (e) => (e.idEndereco || e.id) === enderecoSelecionadoId
  )?.cep;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate("/carrinho")}
          className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Voltar ao carrinho
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Endereços */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  Endereço de Entrega
                </h2>
              </div>
              {enderecos.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Nenhum endereço cadastrado.
                  <button
                    onClick={() => navigate("/perfil")}
                    className="text-purple-600 hover:text-purple-700 font-semibold ml-1"
                  >
                    Cadastre um endereço no seu Perfil.
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enderecos.map((e) => {
                    const id = e.idEndereco || e.id;
                    const label = `${e.rua || ""}, ${
                      e.numCasa || e.numero || ""
                    } - ${e.bairro || ""}, ${e.cidade || ""} - ${
                      e.estado || ""
                    }`;
                    return (
                      <label
                        key={id}
                        className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="endereco"
                          value={id}
                          checked={enderecoSelecionadoId === id}
                          onChange={() => setEnderecoSelecionadoId(id)}
                          className="mt-1 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {label}
                            </span>
                            {e.padrao && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                Padrão
                              </span>
                            )}
                          </div>
                          {e.cep && (
                            <div className="text-xs text-gray-500 mt-1">
                              CEP: {e.cep}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Opções de Frete */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Frete</h2>
              {!cepSelecionado && (
                <div className="text-sm text-gray-500">
                  Selecione um endereço para calcular o frete
                </div>
              )}
              {cepSelecionado && opcoesFrete.length > 0 && (
                <div className="space-y-2">
                  {opcoesFrete.map((opcao) => (
                    <label
                      key={opcao.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="frete"
                        value={opcao.id}
                        checked={freteSelecionado === opcao.id}
                        onChange={(e) => handleFreteChange(e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {opcao.nome}
                          </span>
                          <span className="text-sm">
                            {opcao.valor === 0
                              ? "Grátis"
                              : `R$ ${opcao.valor.toFixed(2)}`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{opcao.prazo}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resumo */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItens} itens)</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>{frete ? `R$ ${frete.toFixed(2)}` : "—"}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={finalizar}
                disabled={loading || !enderecoSelecionadoId}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                {loading ? "Processando..." : "Finalizar Pedido"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
