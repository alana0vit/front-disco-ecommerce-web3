// src/pages/pedidos/Pedidos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PedidoService from "../../services/Pedido";

const statusColor = (s) => {
  switch (s) {
    case "Pago":
      return "bg-green-100 text-green-700";
    case "Aguardando pagamento":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelado":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Pedidos = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const idCliente =
          user?.idCliente || user?.id || user?.cliente?.idCliente;
        if (!idCliente) throw new Error("Cliente não identificado");
        const list = await PedidoService.listarPedidosCliente(idCliente);
        setPedidos(list);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg p-6 border text-center">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((p) => (
              <Link
                key={p.idPedido}
                to={`/pedidos/${p.idPedido}`}
                className="block bg-white rounded-lg border hover:shadow-sm transition"
              >
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">
                      Pedido #{p.idPedido}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      R$ {(Number(p.valorTotal) || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.dataPedido
                        ? new Date(p.dataPedido).toLocaleString("pt-BR")
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusColor(
                        p.statusPedido
                      )}`}
                    >
                      {p.statusPedido || "Aberto"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
