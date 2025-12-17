// src/pages/carrinho/PedidoConfirmado.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";

const PedidoConfirmado = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pedido = state?.pedido;
  const pagamento = state?.pagamento;
  const total = state?.total;

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nada por aqui
          </h1>
          <p className="text-gray-600 mb-6">
            Não encontramos um pedido recente.
          </p>
          <button
            onClick={() => navigate("/produtos")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Ir para a Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-6">
            Obrigado pela sua compra. Em instantes você receberá os detalhes no
            seu e-mail.
          </p>

          <div className="text-left bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Número do Pedido</div>
                <div className="font-semibold text-gray-900">
                  #{pedido.idPedido}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-semibold text-gray-900">
                  R$ {Number(total ?? pedido.valorTotal).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status do Pedido</div>
                <div className="font-semibold text-gray-900">
                  {pedido.statusPedido}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status do Pagamento</div>
                <div className="font-semibold text-gray-900">
                  {pagamento?.statusPag || "Pendente"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/perfil"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Ver Meus Pedidos
            </Link>
            <Link
              to="/produtos"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoConfirmado;
