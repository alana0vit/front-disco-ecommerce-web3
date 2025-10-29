// src/components/Footer.tsx
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import logo from '../assets/DISCOOL_logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Seção principal do footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* Coluna 1: Logo e descrição */}
<div>
  <div className="flex items-center space-x-3 mb-4">
    <img 
      src={logo} 
      alt="discool" 
      className="h-10 w-auto"
    />
  </div>
  <p className="text-gray-400 mb-6 max-w-md">
    Sua loja online especializada em discos de vinil. Encontre
    raridades, clássicos e lançamentos com a melhor qualidade e
    entrega rápida.
  </p>
  <div className="flex space-x-4">
    {/* Redes sociais */}
    <a
      href="#"
      className="text-gray-400 hover:text-purple-400 transition-colors"
    >
      <span className="sr-only">Facebook</span>
      <div className="h-6 w-6">📘</div>
    </a>
    <a
      href="#"
      className="text-gray-400 hover:text-purple-400 transition-colors"
    >
      <span className="sr-only">Instagram</span>
      <div className="h-6 w-6">📷</div>
    </a>
    <a
      href="#"
      className="text-gray-400 hover:text-purple-400 transition-colors"
    >
      <span className="sr-only">Twitter</span>
      <div className="h-6 w-6">🐦</div>
    </a>
    <a
      href="#"
      className="text-gray-400 hover:text-purple-400 transition-colors"
    >
      <span className="sr-only">YouTube</span>
      <div className="h-6 w-6">📺</div>
    </a>
  </div>
</div>

          {/* Coluna 2: Links rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="/produtos"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Todos os Discos
                </a>
              </li>
              <li>
                <a
                  href="/categorias"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Categorias
                </a>
              </li>
              <li>
                <a
                  href="/lancamentos"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Lançamentos
                </a>
              </li>
              <li>
                <a
                  href="/ofertas"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Ofertas
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/contato"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/trocas"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a
                  href="/entregas"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Política de Entregas
                </a>
              </li>
              <li>
                <a
                  href="/privacidade"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Informações de contato */}
        <div className="border-t border-gray-800 mt-8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <DevicePhoneMobileIcon className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Telefone</p>
              <p className="text-white">(11) 9999-9999</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">E-mail</p>
              <p className="text-white">contato@discool.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Endereço</p>
              <p className="text-white">Jaboatão dos Guararapes, PE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 discool. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/termos"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                Termos de Uso
              </a>
              <a
                href="/privacidade"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                Política de Privacidade
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
