// src/components/Header.tsx
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import logo from "../assets/DISCOOL_logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Discos", href: "/produtos" },
  ];

    return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado ESQUERDO: Logo + Navegação */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img 
                src={logo} 
                alt="discool - Discos de Vinil" 
                className="h-8 w-auto"
              />
            </a>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
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
              <button 
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Minha conta"
              >
                <UserIcon className="h-6 w-6" />
              </button>
              <button 
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                title="Carrinho de compras"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button className="p-2">
                <ShoppingBagIcon className="h-6 w-6" />
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
                <a
                  key={item.name}
                  href={item.href}
                  className="hover:text-purple-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-700">
                <button className="flex items-center space-x-2 w-full text-left py-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Minha Conta</span>
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
