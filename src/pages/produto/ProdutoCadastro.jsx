// src/pages/ProductCreate.js
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { productService, categoryService } from '../services/api';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    ativo: true,
    imagem: '',
    id_categoria_prod: ''
  });

  const [errors, setErrors] = useState({});

  // Carregar categorias
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Erro ao carregar categorias'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do produto é obrigatório';
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (!formData.estoque || parseInt(formData.estoque) < 0) {
      newErrors.estoque = 'Estoque não pode ser negativo';
    }

    if (!formData.id_categoria_prod) {
      newErrors.id_categoria_prod = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Por favor, corrija os erros no formulário'
      });
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      // Preparar dados para envio
      const productData = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque),
        id_categoria_prod: parseInt(formData.id_categoria_prod)
      };

      await productService.createProduct(productData);
      
      setSubmitStatus({
        type: 'success',
        message: 'Produto cadastrado com sucesso!'
      });

      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
        ativo: true,
        imagem: '',
        id_categoria_prod: ''
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/produtos');
      }, 2000);

    } catch (err) {
      console.error('Error creating product:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Erro ao cadastrar produto. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          {/* Header do Formulário */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Cadastrar Novo Produto
            </h1>
            <p className="text-purple-100">
              Adicione um novo disco à coleção da discool
            </p>
          </div>

          {/* Alert de Status */}
          {submitStatus && (
            <div className={`mx-6 mt-6 p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {submitStatus.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                ) : (
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Informações Básicas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome do Produto */}
                <div className="md:col-span-2">
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: The Dark Side of the Moon"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label htmlFor="id_categoria_prod" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    id="id_categoria_prod"
                    name="id_categoria_prod"
                    value={formData.id_categoria_prod}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                      errors.id_categoria_prod ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.idCategoria} value={category.idCategoria}>
                        {category.nome}
                      </option>
                    ))}
                  </select>
                  {errors.id_categoria_prod && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_categoria_prod}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="ativo" className="block text-sm font-medium text-gray-700 mb-2">
                    Status do Produto
                  </label>
                  <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                    <input
                      type="checkbox"
                      id="ativo"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="ativo" className="text-sm text-gray-700">
                      Produto ativo e disponível para venda
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preço e Estoque */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Preço e Estoque
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preço */}
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      id="preco"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                        errors.preco ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0,00"
                    />
                  </div>
                  {errors.preco && (
                    <p className="mt-1 text-sm text-red-600">{errors.preco}</p>
                  )}
                </div>

                {/* Estoque */}
                <div>
                  <label htmlFor="estoque" className="block text-sm font-medium text-gray-700 mb-2">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    id="estoque"
                    name="estoque"
                    value={formData.estoque}
                    onChange={handleChange}
                    min="0"
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                      errors.estoque ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Quantidade em estoque"
                  />
                  {errors.estoque && (
                    <p className="mt-1 text-sm text-red-600">{errors.estoque}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descrição
              </h2>
              
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Produto
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Descreva o produto, artista, ano de lançamento, características especiais..."
                />
              </div>
            </div>

            {/* Imagem */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Imagem do Produto
              </h2>
              
              <div>
                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      id="imagem"
                      name="imagem"
                      value={formData.imagem}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Cole a URL de uma imagem do produto. Deixe em branco para usar imagem padrão.
                </p>
              </div>

              {/* Preview da Imagem */}
              {formData.imagem && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={formData.imagem}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Produto'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/produtos')}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;