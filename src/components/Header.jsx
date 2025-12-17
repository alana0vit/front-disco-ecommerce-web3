// src/components/Header.jsx - VERSÃO CORRIGIDA
import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useCarrinho } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/DISCOOL_logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItens } = useCarrinho();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const quantidadeCarrinho = getTotalItens();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Navegação para usuários não logados
  const navigationPublic = [
    { name: "Início", href: "/" },
    { name: "Discos", href: "/produtos" },
  ];

  // Navegação para usuários logados
  const navigationLoggedIn = [
    { name: "Início", href: "/" },
    { name: "Discos", href: "/produtos" },
    { name: "Perfil", href: "/perfil" },
    { name: "Carrinho", href: "/carrinho" },
    { name: "Pedidos", href: "/pedidos" },
  ];

  // Navegação administrativa
  const navigationAdmin = [
    { name: "Gerenciar Produtos", href: "/admin/produtos" },
    { name: "Gerenciar Categorias", href: "/admin/categorias" },
  ];

  // Verificar se o usuário é admin
  const userIsAdmin = useMemo(() => {
    try {
      return isAdmin ? isAdmin() : false;
    } catch (error) {
      console.error("Erro ao verificar admin:", error);
      return false;
    }
  }, [isAdmin]);

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
              {/* Mostra navegação baseada no estado de autenticação */}
              {user ? (
                <>
                  {navigationLoggedIn.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="hover:text-purple-400 transition-colors duration-200 font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {navigationPublic.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="hover:text-purple-400 transition-colors duration-200 font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    className="hover:text-purple-400 transition-colors duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/cadastro"
                    className="hover:text-purple-400 transition-colors duration-200 font-medium"
                  >
                    Cadastro
                  </Link>
                </>
              )}

              {/* Links Administrativos (apenas para admins) */}
              {userIsAdmin && (
                <>
                  <span className="text-gray-500">|</span>
                  <div className="flex items-center space-x-4">
                    <ShieldCheckIcon className="h-4 w-4 text-yellow-400" />
                    {navigationAdmin.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="hover:text-yellow-400 transition-colors duration-200 font-medium text-sm"
                        title="Área administrativa"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </nav>
          </div>

          {/* Lado DIREITO: Ações do usuário */}
          <div className="flex items-center space-x-4">
            {/* User Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {/* Perfil do usuário logado */}
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      Olá,{" "}
                      <span className="font-medium">
                        {user.nome?.split(" ")[0] ||
                          user.name?.split(" ")[0] ||
                          "Usuário"}
                      </span>
                    </div>
                    {userIsAdmin && (
                      <div className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full border border-yellow-800">
                        Admin
                      </div>
                    )}
                    <Link
                      to="/perfil"
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Meu Perfil"
                    >
                      <UserIcon className="h-6 w-6" />
                    </Link>
                    <Link
                      to="/carrinho"
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                      title="Carrinho de compras"
                    >
                      <ShoppingBagIcon className="h-6 w-6" />
                      {quantidadeCarrinho > 0 && (
                        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {quantidadeCarrinho > 99 ? "99+" : quantidadeCarrinho}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300 hover:text-white"
                      title="Sair"
                    >
                      <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Usuário não logado - DESKTOP */}
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    className="px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Cadastrar
                  </Link>
                  <Link
                    to="/carrinho"
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                    title="Carrinho de compras"
                  >
                    <ShoppingBagIcon className="h-6 w-6" />
                    {quantidadeCarrinho > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {quantidadeCarrinho > 99 ? "99+" : quantidadeCarrinho}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button - CORRIGIDO: carrinho aparece sempre */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Carrinho aparece SEMPRE (logado ou não) */}
              <Link to="/carrinho" className="p-2 relative">
                <ShoppingBagIcon className="h-6 w-6" />
                {quantidadeCarrinho > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {quantidadeCarrinho > 99 ? "99+" : quantidadeCarrinho}
                  </span>
                )}
              </Link>

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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  {/* Menu para usuário logado */}
                  <div className="pb-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {user.nome || user.name || "Usuário"}
                        </p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      {userIsAdmin && (
                        <div className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full">
                          Admin
                        </div>
                      )}
                    </div>
                  </div>

                  {navigationLoggedIn.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="hover:text-purple-400 transition-colors duration-200 font-medium py-2 flex items-center justify-between"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      {item.name === "Carrinho" && quantidadeCarrinho > 0 && (
                        <span className="bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {quantidadeCarrinho > 99 ? "99+" : quantidadeCarrinho}
                        </span>
                      )}
                    </Link>
                  ))}

                  {/* Links administrativos (mobile) */}
                  {userIsAdmin && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">
                        Administração
                      </p>
                      {navigationAdmin.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="hover:text-yellow-400 transition-colors duration-200 font-medium py-2 block text-sm pl-4"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShieldCheckIcon className="h-4 w-4 inline mr-2" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left py-2 text-red-400 hover:text-red-300"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Menu para usuário não logado - MOBILE */}
                  {navigationPublic.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="hover:text-purple-400 transition-colors duration-200 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-700 space-y-2">
                    <Link
                      to="/login"
                      className="block py-2 hover:text-purple-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/cadastro"
                      className="block py-2 hover:text-purple-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cadastro
                    </Link>
                    {/* Carrinho já removido daqui pois agora está no botão superior */}
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
