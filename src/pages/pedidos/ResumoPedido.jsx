// src/pages/pedidos/ResumoPedido.jsx
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import PedidoService from "../../services/Pedido";
import carrinhoService from "../../services/Carrinho";

const ResumoPedido = () => {
  const { id } = useParams();
  const location = useLocation();
  const [pedido, setPedido] = useState(location.state?.pedido || null);
  const [pagamento, setPagamento] = useState(location.state?.pagamento || null);
  const [loading, setLoading] = useState(!pedido);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      if (!pedido && id) {
        try {
          const p = await PedidoService.obterPedido(id);
          setPedido(p);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id, pedido]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) return null;

  const itens = pedido.itemPedidos || [];
  const pagamentoId =
    (pagamento && pagamento.idPag) ||
    (pedido.pagamento && pedido.pagamento.idPag);
  const statusPag =
    (pagamento && pagamento.statusPag) ||
    (pedido.pagamento && pedido.pagamento.statusPag);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const confirmarPagamento = async () => {
    if (!pagamentoId) return;
    try {
      setConfirmLoading(true);
      await carrinhoService.atualizarPagamento(pagamentoId, {
        statusPag: "Pago",
      });
      const p = await PedidoService.obterPedido(pedido.idPedido);
      setPedido(p);
      setPagamento(p.pagamento);
    } catch (e) {
      setError(e.message || "Falha ao confirmar pagamento");
    } finally {
      setConfirmLoading(false);
    }
  };

  const cancelarPagamento = async () => {
    if (!pagamentoId) return;
    try {
      setCancelLoading(true);
      await carrinhoService.atualizarPagamento(pagamentoId, {
        statusPag: "Cancelado",
      });
      const p = await PedidoService.obterPedido(pedido.idPedido);
      setPedido(p);
      setPagamento(p.pagamento);
    } catch (e) {
      setError(e.message || "Falha ao cancelar pagamento");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Resumo do Pedido
        </h1>
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">Pedido</div>
              <div className="text-lg font-semibold">#{pedido.idPedido}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-semibold">
                R$ {(Number(pedido.valorTotal) || 0).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {pedido.dataPedido
              ? new Date(pedido.dataPedido).toLocaleString("pt-BR")
              : "—"}
          </div>
        </div>

        {/* Itens */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Itens</h2>
          {itens.length === 0 ? (
            <div className="text-sm text-gray-600">Nenhum item encontrado.</div>
          ) : (
            <div className="space-y-3">
              {itens.map((it) => (
                <div key={it.idItem} className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {it.produto?.nome ||
                        it.produto?.name ||
                        `Produto ${it.produto?.idProduto || ""}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qtd: {it.quantidade}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      R$ {(Number(it.valorUnitario) || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: R$ {(Number(it.valorTotal) || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagamento */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Pagamento</h2>
          <div className="text-sm">
            Método: {pagamento?.metodoPag || pedido.pagamento?.metodoPag || "—"}
          </div>
          <div className="text-sm">
            Status: {statusPag || pedido.statusPedido || "—"}
          </div>
          <div className="text-sm">
            Valor: R${" "}
            {(
              Number(pagamento?.valor) ||
              Number(pedido.valorTotal) ||
              0
            ).toFixed(2)}
          </div>
          {pagamentoId && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={confirmarPagamento}
                disabled={confirmLoading || statusPag === "Pago"}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {confirmLoading ? "Confirmando..." : "Confirmar Pagamento"}
              </button>
              <button
                onClick={cancelarPagamento}
                disabled={cancelLoading || statusPag === "Cancelado"}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {cancelLoading ? "Cancelando..." : "Cancelar Pagamento"}
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            to="/pedidos"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Ver meus pedidos
          </Link>
          <Link
            to="/produtos"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumoPedido;
