import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { productService } from "../../services/Produto";
import { useCarrinho } from "../../context/CartContext";

const ProdutoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarProduto } = useCarrinho();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const available =
    (product?.estoqueDisponivel ??
      Math.max(
        0,
        (product?.estoqueTotal ?? product?.estoque ?? 0) -
        (product?.estoqueReservado ?? 0)
      )) || 0;

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

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    // Permite campo vazio temporariamente
    if (value === "") {
      setQuantity("");
      return;
    }

    const numValue = parseInt(value, 10);

    // Verifica se é um número válido
    if (isNaN(numValue) || numValue < 1) {
      return;
    }

    // Limita pela quantidade em estoque disponível
    const maxQuantity = product ? available : 1;
    const finalQuantity = Math.min(numValue, maxQuantity);

    setQuantity(finalQuantity);
  };

  const handleQuantityBlur = () => {
    // Se o campo ficou vazio, volta para 1
    if (quantity === "") {
      setQuantity(1);
      return;
    }

    // Garante que seja pelo menos 1
    const numValue = parseInt(quantity, 10);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    if (!product) return;
    const newQuantity = Math.min(available, quantity + 1);
    setQuantity(newQuantity);
  };

  const decrementQuantity = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
  };

  const addToCart = () => {
    if (!product || available === 0 || !product.ativo) return;

    const finalQuantity = typeof quantity === "number" ? quantity : 1;

    if (finalQuantity < 1) {
      alert("Quantidade deve ser pelo menos 1");
      return;
    }

    try {
      const produtoFormatado = {
        id: product.idProduto,
        name: product.nome,
        description: product.descricao || "Descrição não disponível",
        price: parseFloat(product.preco),
        image: product.imagemUrl,
        stock: available,
        category: product.categoria?.nome || "Sem categoria",
      };

      adicionarProduto(produtoFormatado, finalQuantity);

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);

      setQuantity(1);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar produto ao carrinho");
    }
  };

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
                src={product.imagemUrl}
                alt={product.nome}
                className="w-full h-96 object-cover rounded-2xl"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/400";
                }}
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
                      className={`text-lg font-semibold ${available > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {available > 0
                        ? `${available} unidades`
                        : "Esgotado"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Status
                    </h4>
                    <p
                      className={`text-lg font-semibold ${product.ativo ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {product.ativo ? "Disponível" : "Indisponível"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="border-t border-gray-200 pt-6">
                {available > 0 && product.ativo ? (
                  <div className="space-y-6">
                    {/* Controle de Quantidade */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Quantidade:
                        </label>
                        <span className="text-xs text-gray-500">
                          Máximo: {available} unidades
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className="w-12 h-12 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 flex items-center justify-center transition-all duration-200 shadow-sm"
                          >
                            <span className="text-lg font-semibold">−</span>
                          </button>

                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max={available}
                              value={quantity}
                              onChange={handleQuantityChange}
                              onBlur={handleQuantityBlur}
                              className="w-20 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold text-lg bg-white shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>

                          <button
                            onClick={incrementQuantity}
                            disabled={quantity >= available}
                            className="w-12 h-12 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 flex items-center justify-center transition-all duration-200 shadow-sm"
                          >
                            <span className="text-lg font-semibold">+</span>
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">
                            Subtotal:
                          </div>
                          <div className="text-xl font-bold text-purple-600">
                            R${" "}
                            {(
                              parseFloat(product.preco) *
                              (typeof quantity === "number" ? quantity : 1)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Botão Adicionar ao Carrinho */}
                    <button
                      onClick={addToCart}
                      disabled={addedToCart}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors duration-200 ${addedToCart
                        ? "bg-green-600 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                    >
                      <ShoppingCartIcon className="h-6 w-6 mr-2" />
                      {addedToCart
                        ? `Adicionado ${quantity} unidade(s)! ✓`
                        : `Adicionar ${quantity} unidade(s) ao Carrinho`}
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
