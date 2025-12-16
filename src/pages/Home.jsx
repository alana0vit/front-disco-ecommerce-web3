// src/pages/Home.jsx - VERSÃO CORRIGIDA
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MusicalNoteIcon,
  ArrowRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { useCarrinho } from "../context/CartContext";
import { productService } from "../services/Produto";
import CategoriaService from "../services/Categoria";
import HeroCarousel from "../components/Carrossel";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { adicionarProduto } = useCarrinho();

  // Dados estáticos para seções de destaque
  const features = [
    {
      icon: <TruckIcon className="h-8 w-8 text-purple-500" />,
      title: "Entrega Rápida",
      description: "Entregamos em todo o Brasil com segurança e agilidade",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-purple-500" />,
      title: "Compra Segura",
      description: "Seus dados protegidos com criptografia de ponta",
    },
    {
      icon: <ArrowPathIcon className="h-8 w-8 text-purple-500" />,
      title: "Garantia Discool",
      description: "Troca gratuita em caso de problemas com o produto",
    },
  ];

  // Buscar produtos em destaque usando o service
  const fetchFeaturedProducts = async () => {
    try {
      const produtos = await productService.getAllProducts();
      const produtosDisponiveis = produtos.filter(
        (produto) => produto.ativo && produto.estoque > 0
      );
      const ultimosProdutos = produtosDisponiveis.slice(-4).reverse();

      const produtosFormatados = ultimosProdutos.map((produto) => ({
        id: produto.idProduto,
        name: produto.nome,
        description: produto.descricao || "Artista não informado",
        price: isNaN(parseFloat(produto.preco)) ? 0 : parseFloat(produto.preco),
        category: produto.categoria?.nome || "Sem categoria",
        image: produto.imagemUrl || "/api/placeholder/300/300",
        stock: produto.estoque,
        rating: 4,
      }));

      setFeaturedProducts(produtosFormatados);
    } catch (err) {
      console.error("Erro ao buscar produtos em destaque:", err);
      setError("Erro ao carregar produtos em destaque");
    }
  };

  // Buscar as 5 categorias com mais produtos
  const fetchTopCategories = async () => {
    try {
      // Usa o serviço que já calcula quantidadeProdutos com base nos produtos
      const categoriasTop = await CategoriaService.listarTopCategorias();

      if (!categoriasTop || categoriasTop.length === 0) {
        setTopCategories([]);
        return;
      }

      const mapped = categoriasTop.map((categoria) => ({
        id: categoria.idCategoria ?? categoria.id,
        name: categoria.nome ?? categoria.name,
        count: categoria.quantidadeProdutos ?? categoria.count ?? 0,
        image: getCategoryEmoji(categoria.nome ?? categoria.name),
      }));

      setTopCategories(mapped);
    } catch (err) {
      console.error("Erro ao buscar categorias em destaque:", err);
      setTopCategories([]);
    }
  };

  // Função para obter emoji baseado no nome da categoria
  const getCategoryEmoji = (categoryName) => {
    const emojiMap = {
      rock: "🎸",
      jazz: "🎷",
      mpb: "🎵",
      clássica: "🎻",
      clássico: "🎻",
      eletrônica: "🎹",
      eletrônico: "🎹",
      "hip hop": "🎤",
      pop: "🎤",
      samba: "🎶",
      forró: "🪕",
      funk: "🔊",
      blues: "🎸",
      reggae: "🌿",
      metal: "🤘",
      indie: "🎧",
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) {
        return emoji;
      }
    }

    // Emoji padrão se não encontrar correspondência
    const defaultEmojis = [
      "🎵",
      "🎶",
      "🎼",
      "🎧",
      "🎸",
      "🎷",
      "🎹",
      "🎻",
      "🥁",
      "🎤",
    ];
    return defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
  };

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar em paralelo para melhor performance
        await Promise.all([fetchFeaturedProducts(), fetchTopCategories()]);
      } catch (err) {
        console.error("Erro ao carregar dados da página inicial:", err);
        setError("Erro ao carregar dados da página inicial");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAdicionarCarrinho = (product) => {
    adicionarProduto(product, 1); // Adiciona 1 unidade por padrão

    // Feedback visual
    const button = document.querySelector(`[data-product-id="${product.id}"]`);
    if (button) {
      button.textContent = "Adicionado!";
      button.classList.add("bg-green-600");
      setTimeout(() => {
        button.textContent = "Adicionar";
        button.classList.remove("bg-green-600");
      }, 1500);
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando discos incríveis...</p>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Categorias em Destaque - Só mostra se houver categorias */}
      {topCategories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Gêneros Mais Populares
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubra os gêneros mais procurados em nossa coleção
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/produtos?categoria=${encodeURIComponent(
                    category.name
                  )}`}
                  className="bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-6 text-center transition-all duration-200 group"
                >
                  <div className="text-4xl mb-3">{category.image}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.count} {category.count === 1 ? "disco" : "discos"}
                  </p>
                </Link>
              ))}
            </div>

            {/* Link para ver todas as categorias */}
            <div className="text-center mt-8">
              <Link
                to="/produtos"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
              >
                Ver todos os gêneros disponíveis
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Novos Lançamentos
              </h2>
              <p className="text-lg text-gray-600">
                Últimos discos adicionados em nossa coleção
              </p>
            </div>
            <Link
              to="/produtos"
              className="hidden md:flex items-center text-purple-600 hover:text-purple-700 font-semibold"
            >
              Ver todos
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    {/* Imagem clicável */}
                    <Link
                      to={`/produtos/show/${product.id}`}
                      className="block cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/300";
                        }}
                      />
                    </Link>
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < product.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 h-10">
                      {product.description}
                    </p>

                    {/* Preço */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        R$ {product.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    {/* Botões */}
                    <div className="flex space-x-2">
                      <button
                        data-product-id={product.id}
                        onClick={() => handleAdicionarCarrinho(product)}
                        className="flex-1 bg-gray-900 hover:bg-purple-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                      >
                        Adicionar
                      </button>
                      <Link
                        to={`/produtos/show/${product.id}`}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors text-center block"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MusicalNoteIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Nenhum produto disponível no momento
              </p>
              <Link
                to="/produtos"
                className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-semibold"
              >
                Ver catálogo completo
              </Link>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/produtos"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
            >
              Ver todos os discos
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a discool?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A melhor experiência em compra de discos de vinil, do clássico ao
              raro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <MusicalNoteIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua coleção?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Junte-se a milhares de amantes de vinil que já descobriram seus
            discos dos sonhos na discool
          </p>
          <Link
            to="/produtos"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
          >
            Explorar Catálogo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
