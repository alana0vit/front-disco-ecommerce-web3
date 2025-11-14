// src/pages/AdminProdutos.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  productService,
  categoryService,
  debugProducts,
} from "../../services/Produto";

const AdminProdutos = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [filters, setFilters] = useState({
    nome: "",
    categoria: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Estado para confirmação de exclusão
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Carregar produtos e categorias
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // No AdminProdutos.jsx, dentro do loadProducts, adicione:
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();

      // DEBUG: Verificar estrutura dos produtos
      console.log("=== ADMIN PRODUTOS DEBUG ===");
      debugProducts(data); // Use a função de debug do serviço

      setProducts(data);
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

  // Aplicar filtros localmente - CORRIGIDO
  const filteredProducts = products.filter((product) => {
    // Filtro por nome
    if (
      filters.nome &&
      !product.nome.toLowerCase().includes(filters.nome.toLowerCase())
    ) {
      return false;
    }

    // Filtro por categoria - CORRIGIDO
    if (filters.categoria) {
      const categoriaId =
        product.categoria?.idCategoria || product.id_categoria_prod;
      if (categoriaId !== parseInt(filters.categoria)) {
        return false;
      }
    }

    // Filtro por status - CORRIGIDO
    if (filters.status === "ativo" && !product.ativo) {
      return false;
    }
    if (filters.status === "inativo" && product.ativo) {
      return false;
    }

    return true;
  });

  // Contadores para estatísticas - CORRIGIDOS
  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.ativo === true || p.ativo === 1
  ).length;
  const inactiveProducts = products.filter(
    (p) => p.ativo === false || p.ativo === 0
  ).length;

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      nome: "",
      categoria: "",
      status: "",
    });
  };

  // Confirmar exclusão
  const confirmDelete = (product) => {
    setProductToDelete(product);
  };

  // Cancelar exclusão
  const cancelDelete = () => {
    setProductToDelete(null);
  };

  // Executar exclusão
  const executeDelete = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);
    try {
      await productService.deleteProduct(productToDelete.idProduto);
      alert("Produto excluído com sucesso!");
      loadProducts(); // Recarregar a lista
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Erro ao excluir produto");
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
    }
  };

  // Função para obter nome da categoria - CORRIGIDA
  const getCategoryName = (category) => {
    if (typeof category === "object" && category.nome) {
      return category.nome;
    }

    // Se não tiver categoria no objeto, buscar pelo ID
    if (category && categories.length > 0) {
      const categoria = categories.find((cat) => cat.idCategoria === category);
      return categoria ? categoria.nome : "Sem categoria";
    }

    return "Sem categoria";
  };

  // Função para obter o ID da categoria - NOVA
  const getCategoryId = (product) => {
    return product.categoria?.idCategoria || product.id_categoria_prod;
  };

  // Função para verificar status - CORRIGIDA
  const getProductStatus = (product) => {
    return product.ativo === true || product.ativo === 1;
  };

  // Função para formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciar Produtos
            </h1>
            <p className="text-gray-600 mt-2">
              Administre todos os produtos da loja
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/admin/categorias"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
            >
              <TagIcon className="h-5 w-5 mr-2" />
              Gerenciar Categorias
            </Link>
            <Link
              to="/admin/produtos/novo"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Produto
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Barra de Pesquisa */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
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
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-700 px-4 py-3 font-semibold"
              >
                Limpar
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
                    <option
                      key={category.idCategoria}
                      value={category.idCategoria}
                    >
                      {category.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Todos os status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas - CORRIGIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Produtos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Produtos Ativos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Produtos Inativos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {inactiveProducts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Produtos ({filteredProducts.length})
            </h2>
          </div>

          {error ? (
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
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {products.length === 0
                  ? "Comece adicionando seu primeiro produto"
                  : "Tente ajustar os filtros ou termos de busca"}
              </p>
              {products.length === 0 && (
                <Link
                  to="/admin/produtos/novo"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Cadastrar Primeiro Produto
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const isActive = getProductStatus(product);
                    const categoryId = getCategoryId(product);

                    return (
                      <tr key={product.idProduto} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={
                                  product.imagemUrl || "/api/placeholder/40/40"
                                }
                                alt={product.nome}
                                onError={(e) => {
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3E📦%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.nome}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                {product.descricao || "Sem descrição"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getCategoryName(product.categoria || categoryId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(product.preco)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              product.estoque > 10
                                ? "text-green-600"
                                : product.estoque > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.estoque} unidades
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isActive ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/produtos/${product.idProduto}`}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Ver detalhes"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/produtos/editar/${product.idProduto}`}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-colors"
                              title="Editar produto"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(product)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Excluir produto"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {productToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmar Exclusão
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Tem certeza que deseja excluir o produto{" "}
                <strong>"{productToDelete.nome}"</strong>? Esta ação não pode
                ser desfeita.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  disabled={deleteLoading}
                  className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Excluindo...
                    </>
                  ) : (
                    "Excluir"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para ícone de check
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default AdminProdutos;
