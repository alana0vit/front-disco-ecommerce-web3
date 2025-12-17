// src/pages/produto/Products.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { productService, categoryService } from "../../services/Produto";
import { useCarrinho } from "../../context/CartContext";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adicionarProduto } = useCarrinho();
  const location = useLocation();

  // Estados para filtros
  const [filters, setFilters] = useState({
    nome: "",
    categoria: "",
    precoMin: "",
    precoMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Carregar produtos e categorias
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Sincroniza filtros com a URL (vindo do Home)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nome = params.get("nome") || "";
    const categoria = params.get("categoria") || "";
    const precoMin = params.get("precoMin") || "";
    const precoMax = params.get("precoMax") || "";

    // Atualiza estado e aplica filtro
    const newFilters = { nome, categoria, precoMin, precoMax };
    setFilters(newFilters);
    // Se houver algum filtro definido na URL, aplica
    if (nome || categoria || precoMin || precoMax) {
      loadProducts(newFilters);
    }
  }, [location.search]);

  const loadProducts = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (Object.keys(filterParams).length > 0) {
        data = await productService.filterProducts(filterParams);
      } else {
        data = await productService.getAllProducts();
      }

      // Filtrar apenas produtos ativos (se a propriedade existir)
      const activeProducts = data.filter((product) => product.ativo !== false);
      setProducts(activeProducts);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Aplicar filtros
  const handleFilter = (e) => {
    e.preventDefault();
    loadProducts(filters);
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      nome: "",
      categoria: "",
      precoMin: "",
      precoMax: "",
    });
    loadProducts();
  };

  // Adicionar ao carrinho
  const addToCart = (product) => {
    const available =
      product.estoqueDisponivel ??
      Math.max(
        0,
        (product.estoqueTotal ?? product.estoque ?? 0) -
          (product.estoqueReservado ?? 0)
      );

    if (available === 0) {
      alert("Produto esgotado!");
      return;
    }

    try {
      // Formatar o produto igual na Home
      const produtoFormatado = {
        id: product.idProduto,
        name: product.nome,
        description: product.descricao || "Descrição não disponível",
        price: parseFloat(product.preco),
        image: product.imagemUrl,
        stock: available,
        category: product.categoria?.nome || "Sem categoria",
      };

      // Usar o context igual na Home e ProdutoDetalhes
      adicionarProduto(produtoFormatado, 1);
      //alert(`${product.nome} adicionado ao carrinho!`);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      //alert("Erro ao adicionar produto ao carrinho");
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <button
              onClick={loadProducts}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nossa Coleção</h1>
          <p className="text-gray-600 mt-2">
            Descubra discos incríveis para sua coleção
          </p>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Barra de Pesquisa */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar discos, artistas..."
                  value={filters.nome}
                  onChange={(e) =>
                    setFilters({ ...filters, nome: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Botão Filtros */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 text-gray-600" />
                <span>Filtros</span>
              </button>

              <button
                onClick={handleFilter}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) =>
                    setFilters({ ...filters, categoria: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.idCategoria} value={category.nome}>
                      {category.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Preço Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Mínimo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={filters.precoMin}
                  onChange={(e) =>
                    setFilters({ ...filters, precoMin: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Filtro por Preço Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Máximo
                </label>
                <input
                  type="number"
                  placeholder="R$ 500,00"
                  value={filters.precoMax}
                  onChange={(e) =>
                    setFilters({ ...filters, precoMax: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Botão Limpar Filtros */}
              <div className="md:col-span-3">
                <button
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid de Produtos */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {products.length}{" "}
              {products.length === 1
                ? "disco encontrado"
                : "discos encontrados"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum disco encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros ou termos de busca
              </p>
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.idProduto}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Imagem do Produto - Agora clicável */}
                  <div className="relative overflow-hidden">
                    <Link
                      to={`/produtos/show/${product.idProduto}`}
                      className="block cursor-pointer"
                    >
                      <img
                        src={product.imagemUrl}
                        alt={product.nome}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300?text=Imagem+não+disponível";
                        }}
                      />
                    </Link>

                    {(
                      (product.estoqueDisponivel ??
                        Math.max(
                          0,
                          (product.estoqueTotal ?? product.estoque ?? 0) -
                            (product.estoqueReservado ?? 0)
                        )) === 0
                    ) && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        Esgotado
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {getCategoryName(product.categoria)}
                    </div>
                  </div>

                  {/* Informações do Produto */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {product.nome}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.descricao || "Descrição não disponível"}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-purple-600">
                        R$ {parseFloat(product.preco).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Estoque: {
                          product.estoqueDisponivel ??
                            Math.max(
                              0,
                              (product.estoqueTotal ?? product.estoque ?? 0) -
                                (product.estoqueReservado ?? 0)
                            )
                        }
                      </span>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/produtos/show/${product.idProduto}`}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg text-center font-semibold transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={
                          (product.estoqueDisponivel ??
                            Math.max(
                              0,
                              (product.estoqueTotal ?? product.estoque ?? 0) -
                                (product.estoqueReservado ?? 0)
                            )) === 0
                        }
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                        title="Adicionar ao carrinho"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Produtos;
