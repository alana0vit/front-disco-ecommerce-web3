// src/pages/ProductDetails.js
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { productService } from "../../services/Produto";
import carrinhoService from "../../services/Carrinho";


const ProdutoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError("Produto não encontrado");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product || product.estoque === 0 || !product.ativo) return;

    try {
      carrinhoService.adicionarItem(product, quantity);
      alert(`${quantity}x ${product.nome} adicionado ao carrinho!`);

      // Resetar quantidade após adicionar
      setQuantity(1);

      // Opcional: atualizar algum estado global de carrinho se necessário
      console.log("Carrinho atual:", carrinhoService.getCarrinhoFromStorage());
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar produto ao carrinho");
    }
  };

  // Função para obter nome da categoria
  const getCategoryName = (category) => {
    if (typeof category === "object" && category.nome) {
      return category.nome;
    }
    return "Categoria não especificada";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Produto não encontrado"}
            </h2>
            <button
              onClick={() => navigate("/produtos")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Voltar para a Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/produtos"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar para a Loja
          </Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Imagem do Produto */}
            <div>
              <img
                src={
                  product.imagem ||
                  "https://images.unsplash.com/photo-1598387993441-6f2ccba83b5b?w=600&h=600&fit=crop"
                }
                alt={product.nome}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>

            {/* Informações do Produto */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-2">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {getCategoryName(product.categoria)}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.nome}
                </h1>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">
                    R$ {parseFloat(product.preco).toFixed(2)}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.descricao ||
                      "Descrição não disponível para este produto."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Estoque
                    </h4>
                    <p
                      className={`text-lg font-semibold ${
                        product.estoque > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.estoque > 0
                        ? `${product.estoque} unidades`
                        : "Esgotado"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Status
                    </h4>
                    <p
                      className={`text-lg font-semibold ${
                        product.ativo ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.ativo ? "Disponível" : "Indisponível"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="border-t border-gray-200 pt-6">
                {product.estoque > 0 && product.ativo ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">
                        Quantidade:
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(Math.min(product.estoque, quantity + 1))
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        Máximo: {product.estoque}
                      </span>
                    </div>

                    <button
                      onClick={addToCart}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <ShoppingCartIcon className="h-6 w-6 mr-2" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg font-semibold text-lg cursor-not-allowed"
                  >
                    Produto Indisponível
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhes;
