// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import carrinhoService from "../services/Carrinhos";
import logo from "../assets/DISCOOL_logo.png";

const Header = ({ onAbrirCarrinho }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Discos", href: "/produtos" },
    { name: "Login", href: "/login" },
    { name: "Cadastro", href: "/cadastro" },
  ];

  // Atualizar quantidade do carrinho
  useEffect(() => {
    const updateQuantidadeCarrinho = () => {
      setQuantidadeCarrinho(carrinhoService.getQuantidadeTotal());
    };

    // Atualizar inicialmente
    updateQuantidadeCarrinho();

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      updateQuantidadeCarrinho();
    };

    // Adicionar listeners
    window.addEventListener("storage", handleStorageChange);

    // Polling para atualizar em caso de mudanças na mesma aba
    const interval = setInterval(updateQuantidadeCarrinho, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleAbrirCarrinho = () => {
    if (onAbrirCarrinho) {
      onAbrirCarrinho();
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado ESQUERDO: Logo + Navegação */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="discool - Discos de Vinil"
                className="h-8 w-auto"
              />
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Lado DIREITO: Busca + Ações do usuário */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex max-w-xs">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Buscar discos, artistas..."
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* User Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/perfil"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Meu Perfil"
              >
                <UserIcon className="h-6 w-6" />
              </Link>
              <button
                onClick={handleAbrirCarrinho}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                title="Carrinho de compras"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                {quantidadeCarrinho > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {quantidadeCarrinho}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button onClick={handleAbrirCarrinho} className="p-2 relative">
                <ShoppingBagIcon className="h-6 w-6" />
                {quantidadeCarrinho > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {quantidadeCarrinho}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar discos, artistas..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="hover:text-purple-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-700">
                <Link
                  to="/perfil"
                  className="flex items-center space-x-2 w-full text-left py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Meu Perfil</span>
                </Link>
                <button
                  onClick={() => {
                    handleAbrirCarrinho();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left py-2"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span>
                    Carrinho{" "}
                    {quantidadeCarrinho > 0 && `(${quantidadeCarrinho})`}
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
