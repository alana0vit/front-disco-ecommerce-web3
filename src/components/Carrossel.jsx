// src/components/HeroCarousel.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Dados mockados - depois virão do backend
const heroSlides = [
  {
    id: 1,
    title: "A magia do vinil na",
    highlight: "discool",
    description: "Descobre milhares de discos raros, clássicos atemporais e lançamentos exclusivos. A experiência musical que mereces.",
    image: "https://images.unsplash.com/photo-1598387993441-6f2ccba83b5b?w=1200&h=600&fit=crop",
    buttonText: "Explorar Discos",
    buttonLink: "/produtos",
    secondaryButtonText: "Novidades",
    secondaryButtonLink: "/lancamentos",
    theme: "purple"
  },
  {
    id: 2,
    title: "Coleções Exclusivas",
    highlight: "Edições Limitadas",
    description: "Descobre vinis raros e edições especiais que você não encontra em nenhum outro lugar.",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=600&fit=crop",
    buttonText: "Ver Coleções",
    buttonLink: "/colecoes",
    secondaryButtonText: "Raridades",
    secondaryButtonLink: "/raridades",
    theme: "blue"
  },
  {
    id: 3,
    title: "Lançamentos da Semana",
    highlight: "Fresh Pressings",
    description: "Os discos mais recentes direto da prensa para a sua coleção. Fique por dentro das novidades.",
    image: "https://images.unsplash.com/photo-1593696141114-c2908a590b56?w=1200&h=600&fit=crop",
    buttonText: "Novos Lançamentos",
    buttonLink: "/lancamentos",
    secondaryButtonText: "Pré-vendas",
    secondaryButtonLink: "/pre-vendas",
    theme: "pink"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const getGradient = (theme) => {
    switch (theme) {
      case 'blue':
        return 'from-blue-900 to-gray-900';
      case 'pink':
        return 'from-pink-900 to-gray-900';
      default:
        return 'from-gray-900 to-purple-900';
    }
  };

  const getHighlightGradient = (theme) => {
    switch (theme) {
      case 'blue':
        return 'from-blue-400 to-cyan-400';
      case 'pink':
        return 'from-pink-400 to-rose-400';
      default:
        return 'from-purple-400 to-pink-400';
    }
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section 
      className="relative h-screen max-h-[800px] text-white overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(currentSlideData.theme)} opacity-90`} />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              {currentSlideData.title}{' '}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${getHighlightGradient(currentSlideData.theme)}`}>
                {currentSlideData.highlight}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up">
              {currentSlideData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link
                to={currentSlideData.buttonLink}
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center group"
              >
                {currentSlideData.buttonText}
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={currentSlideData.secondaryButtonLink}
                className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
              >
                {currentSlideData.secondaryButtonText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-5000 ease-linear"
          style={{ 
            width: isAutoPlaying ? '100%' : '0%',
            transition: isAutoPlaying ? 'width 5s linear' : 'none'
          }}
          key={currentSlide}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;