// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { 
  MusicalNoteIcon,
  ArrowRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import HeroCarousel from '../components/Carrossel';

const Home = () => {
  // Dados mockados para produtos em destaque
  const featuredProducts = [
    {
      id: 1,
      name: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      price: 129.90,
      category: 'Rock Progressivo',
      image: 'https://images.unsplash.com/photo-1598387993441-6f2ccba83b5b?w=400&h=400&fit=crop',
      rating: 5
    },
    {
      id: 2,
      name: 'Kind of Blue',
      artist: 'Miles Davis',
      price: 119.90,
      category: 'Jazz',
      image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
      rating: 5
    },
    {
      id: 3,
      name: 'Abbey Road',
      artist: 'The Beatles',
      price: 109.90,
      category: 'Rock',
      image: 'https://images.unsplash.com/photo-1593696141114-c2908a590b56?w=400&h=400&fit=crop',
      rating: 4
    },
    {
      id: 4,
      name: 'Thriller',
      artist: 'Michael Jackson',
      price: 99.90,
      category: 'Pop',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
      rating: 4
    }
  ];

  const categories = [
    { name: 'Rock', count: 156, image: '🎸' },
    { name: 'Jazz', count: 89, image: '🎷' },
    { name: 'MPB', count: 124, image: '🎵' },
    { name: 'Clássica', count: 67, image: '🎻' },
    { name: 'Eletrônica', count: 92, image: '🎹' },
    { name: 'Hip Hop', count: 78, image: '🎤' }
  ];

  const features = [
    {
      icon: <TruckIcon className="h-8 w-8 text-purple-500" />,
      title: 'Entrega Rápida',
      description: 'Entregamos em todo o Brasil com segurança e agilidade'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-purple-500" />,
      title: 'Compra Segura',
      description: 'Seus dados protegidos com criptografia de ponta'
    },
    {
      icon: <ArrowPathIcon className="h-8 w-8 text-purple-500" />,
      title: 'Garantia Discool',
      description: 'Troca gratuita em caso de problemas com o produto'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section substituída pelo Carousel */}
      <HeroCarousel />

      {/* Categorias */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explorar por Gênero
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontra o som perfeito entre nossas categorias cuidadosamente organizadas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/categorias/${category.name.toLowerCase()}`}
                className="bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-6 text-center transition-all duration-200 group"
              >
                <div className="text-4xl mb-3">{category.image}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.count} discos
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discos em Destaque
              </h2>
              <p className="text-lg text-gray-600">
                Seleção especial dos nossos melhores vinis
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{product.artist}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button className="bg-gray-900 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
              A melhor experiência em compra de discos de vinil, do clássico ao raro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-lienar-to-r from-purple-600 to-pink-600 text-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <MusicalNoteIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua coleção?
          </h2>
          <p className="text-xl text-purple-500 mb-8">
            Junte-se a milhares de amantes de vinil que já descobriram seus discos dos sonhos na discool
          </p>
          <Link
            to="/cadastro"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
          >
            Criar Minha Conta
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;