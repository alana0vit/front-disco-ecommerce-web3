import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import carrinhoService from "../../services/Carrinho";
import PedidoService from "../../services/Pedido";

const metodos = [
  { id: "Pix", label: "PIX" },
  { id: "Cartão", label: "Cartão" },
  { id: "Boleto", label: "Boleto" },
];

const Pagamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pedidoState = location.state?.pedido || null;
  const totalState = location.state?.total || null;

  const [pedido, setPedido] = useState(pedidoState);
  const [valor, setValor] = useState(totalState || 0);
  const [metodo, setMetodo] = useState("Pix");
  const [pagamento, setPagamento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackMsg, setFallbackMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (!pedido && id) {
        try {
          const p = await PedidoService.obterPedido(id);
          setPedido(p);
          setValor(Number(p.valorTotal) || 0);
        } catch (e) {
          setError(e.message);
        }
      }
    })();
  }, [id, pedido]);

  const criarPagamento = async () => {
    if (!pedido) return;
    try {
      setLoading(true);
      setError(null);
      setFallbackMsg(null);
      const resp = await carrinhoService.criarPagamento({
        idPedido: pedido.idPedido,
        valor: Number(valor),
        metodoPag: metodo,
      });
      setPagamento(resp);
    } catch (e) {
      setError(e.message || "Falha ao criar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (status) => {
    if (!pedido) return;
    try {
      setLoading(true);
      setError(null);
      const novoStatusPedido = status === "Cancelado" ? "Cancelado" : "Pago";
      await PedidoService.atualizarPedido(pedido.idPedido, {
        statusPedido: novoStatusPedido,
      });
      // Reflete imediatamente no UI, sem chamar PATCH pagamento
      if (pagamento) setPagamento({ ...pagamento, statusPag: status });
      setFallbackMsg(
        `Confirmação aplicada no app (simulado). O backend não alterou o pagamento. Estoque será atualizado quando o backend validar.`
      );
      const p = await PedidoService.obterPedido(pedido.idPedido);
      setPedido(p);
      setPagamento(p.pagamento);
    } catch (e) {
      const serverMsg = e?.response?.data?.message;
      setError(serverMsg || e.message || "Falha ao atualizar status do pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pagamento</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {fallbackMsg && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            {fallbackMsg}
          </div>
        )}

        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">Pedido</div>
              <div className="text-lg font-semibold">
                #{pedido?.idPedido || id}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-semibold">
                R$ {(Number(valor) || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Seleção de método */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Método de Pagamento</h2>
          <div className="space-y-2">
            {metodos.map((m) => (
              <label
                key={m.id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="metodo"
                  value={m.id}
                  checked={metodo === m.id}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">{m.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={criarPagamento}
            disabled={loading || !pedido}
            className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
          >
            {loading ? "Processando..." : "Criar Pagamento"}
          </button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-2">Status</h2>
          <div className="text-sm">
            {pagamento?.statusPag ||
              pedido?.statusPedido ||
              "Aguardando pagamento"}
          </div>
          {pagamento && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => atualizarStatus("Pago")}
                disabled={loading || pagamento?.statusPag === "Pago"}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? "Confirmando..." : "Confirmar Pagamento"}
              </button>
              <button
                onClick={() => atualizarStatus("Cancelado")}
                disabled={loading || pagamento?.statusPag === "Cancelado"}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? "Cancelando..." : "Cancelar Pagamento"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() =>
              navigate(`/pedido/resumo/${pedido?.idPedido || id}`, {
                state: { pedido, pagamento },
              })
            }
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Ver resumo
          </button>
          <button
            onClick={() => navigate("/pedidos")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Ver histórico
          </button>
          <button
            onClick={() => navigate("/produtos")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
