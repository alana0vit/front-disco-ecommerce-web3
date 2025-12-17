// src/pages/pedidos/PedidoDetalhes.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PedidoService from "../../services/Pedido";

const PedidoDetalhes = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await PedidoService.obterPedido(id);
        setPedido(p);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const atualizarStatusPedido = async (novoStatus) => {
    if (!pedido) return;
    try {
      setActionLoading(true);
      setActionError(null);
      setInfoMsg(null);
      await PedidoService.atualizarPedido(pedido.idPedido, {
        statusPedido: novoStatus,
      });
      const atualizado = await PedidoService.obterPedido(pedido.idPedido);
      setPedido(atualizado);
      setInfoMsg(
        novoStatus === "Cancelado"
          ? "Cancelamento aplicado no app (simulado). O backend não alterou o pagamento."
          : "Confirmação aplicada no app (simulado). O backend não alterou o pagamento."
      );
    } catch (e) {
      setActionError(
        e?.response?.data?.message || e.message || "Falha ao atualizar pedido"
      );
    } finally {
      setActionLoading(false);
    }
  };

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

  if (!pedido) {
    return null;
  }

  const itens = pedido.itemPedidos || [];
  const endereco = pedido.endereco || {};
  const pagamento = pedido.pagamento || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Pedido #{pedido.idPedido}
          </h1>
          <Link
            to="/pedidos"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Voltar
          </Link>
        </div>

        {/* Status e Totais */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-lg font-semibold">{pedido.statusPedido}</div>
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
          {infoMsg && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg">
              {infoMsg}
            </div>
          )}
          {actionError && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
              {actionError}
            </div>
          )}
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

        {/* Entrega */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Entrega</h2>
          <div className="text-sm text-gray-700">
            {(endereco.rua || "") +
              ", " +
              (endereco.numCasa || endereco.numero || "")}
            {" - " + (endereco.bairro || "")}
            {", " + (endereco.cidade || "")}
            {" - " + (endereco.estado || "")}
          </div>
          <div className="text-xs text-gray-500">
            CEP: {endereco.cep || "—"}
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-2">Pagamento</h2>
          <div className="text-sm">Método: {pagamento.metodoPag || "—"}</div>
          <div className="text-sm">Status do pedido: {pedido.statusPedido}</div>
          <div className="text-sm">
            Status do pagamento: {pagamento.statusPag || "—"}
          </div>
          <div className="text-sm">
            Valor: R${" "}
            {(
              Number(pagamento.valor) ||
              Number(pedido.valorTotal) ||
              0
            ).toFixed(2)}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => atualizarStatusPedido("Pago")}
              disabled={actionLoading || pedido.statusPedido === "Pago"}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              {actionLoading ? "Confirmando..." : "Confirmar Pagamento"}
            </button>
            <button
              onClick={() => atualizarStatusPedido("Cancelado")}
              disabled={actionLoading || pedido.statusPedido === "Cancelado"}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              {actionLoading ? "Cancelando..." : "Cancelar Pagamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalhes;
