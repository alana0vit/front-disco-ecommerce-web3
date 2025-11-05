// src/components/Checkout.jsx
import { useState } from 'react';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import api from '../../services/Api';
import carrinhoService from '../../services/Carrinhos';

const Checkout = ({ pedido, onBack, onSuccess }) => {
  const [metodoPagamento, setMetodoPagamento] = useState('Pix');
  const [loading, setLoading] = useState(false);
  const [pagamentoRealizado, setPagamentoRealizado] = useState(false);

  const processarPagamento = async () => {
    setLoading(true);
    try {
      // 1. Criar o pagamento
      const pagamentoData = {
        valor: pedido.valorTotal,
        statusPag: 'Pago',
        metodoPag: metodoPagamento,
        pedido: { idPedido: pedido.idPedido }
      };

      const pagamentoResponse = await api.post('/pagamento', pagamentoData);
      
      // 2. Atualizar o status do pedido para "Pago"
      await api.patch(`/pedido/${pedido.idPedido}`, {
        statusPedido: 'Pago'
      });

      // 3. O estoque será atualizado AUTOMATICAMENTE no back-end
      // conforme a regra de negócio (após confirmação do pagamento)
      
      setPagamentoRealizado(true);
      
      // 4. Limpar carrinho e mostrar sucesso
      setTimeout(() => {
        carrinhoService.limparCarrinho();
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (pagamentoRealizado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Seu pedido foi processado com sucesso. O estoque foi atualizado.
          </p>
          <button
            onClick={onSuccess}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar ao carrinho
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

          {/* Resumo do Pedido */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Número do Pedido:</span>
                <span className="font-semibold">#{pedido.idPedido}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="text-xl font-bold text-purple-600">
                  R$ {pedido.valorTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Método de Pagamento</h2>
            <div className="space-y-3">
              {['Pix', 'Cartão', 'Boleto'].map((metodo) => (
                <label key={metodo} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="metodoPagamento"
                    value={metodo}
                    checked={metodoPagamento === metodo}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-medium">{metodo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botão de Confirmação */}
          <button
            onClick={processarPagamento}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold text-lg"
          >
            {loading ? 'Processando Pagamento...' : `Pagar R$ ${pedido.valorTotal.toFixed(2)}`}
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            O estoque será atualizado automaticamente após a confirmação do pagamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;