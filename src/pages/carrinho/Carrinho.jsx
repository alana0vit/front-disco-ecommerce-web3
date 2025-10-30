// src/pages/Cart.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  // Dados mockados do carrinho - depois virão do backend/context
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      price: 129.90,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1598387993441-6f2ccba83b5b?w=300&h=300&fit=crop',
      category: 'Rock Progressivo',
      stock: 5
    },
    {
      id: 2,
      name: 'Kind of Blue',
      artist: 'Miles Davis',
      price: 119.90,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
      category: 'Jazz',
      stock: 3
    },
    {
      id: 3,
      name: 'Abbey Road',
      artist: 'The Beatles',
      price: 109.90,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1593696141114-c2908a590b56?w=300&h=300&fit=crop',
      category: 'Rock',
      stock: 8
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return cartItems.length > 0 ? 15.00 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // Carrinho vazio
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
            <p className="text-lg text-gray-600 mb-8">
              Descubra discos incríveis para adicionar à sua coleção
            </p>
            <Link
              to="/produtos"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header da Lista */}
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Itens</h3>
                  <span className="text-sm text-gray-500">
                    Total: R$ {calculateSubtotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Lista de Produtos */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Imagem do Disco */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-gray-600">{item.artist}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-lg font-bold text-purple-600 mt-1">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Controles de Quantidade e Remover */}
                      <div className="flex flex-col items-end space-y-3">
                        {/* Botão Remover */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>

                        {/* Controle de Quantidade */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Subtotal do Item */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continuar Comprando */}
            <div className="mt-6">
              <Link
                to="/produtos"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Continuar Comprando
              </Link>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h3>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">R$ {calculateSubtotal().toFixed(2)}</span>
                </div>

                {/* Frete */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">
                    {calculateShipping() > 0 ? `R$ ${calculateShipping().toFixed(2)}` : 'Grátis'}
                  </span>
                </div>

                {/* Descontos */}
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- R$ 0,00</span>
                </div>

                {/* Linha Divisória */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">
                      R$ {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Informações de Frete */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    🚚 Frete grátis para compras acima de R$ 200,00
                  </p>
                </div>

                {/* Botão Finalizar Compra */}
                <Link
                  to="/checkout"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg text-center block transition-colors duration-200"
                >
                  Finalizar Compra
                </Link>

                {/* Métodos de Pagamento */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Métodos de pagamento aceitos</p>
                  <div className="flex justify-center space-x-2">
                    <span className="text-lg">💳</span>
                    <span className="text-lg">📄</span>
                    <span className="text-lg">🔗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;