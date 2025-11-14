// src/pages/CategoriaCadastro.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  TagIcon   
} from '@heroicons/react/24/outline';
import CategoriaService from '../../services/Categoria';

const CategoriaCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      carregarCategoria();
    }
  }, [id]);

  const carregarCategoria = async () => {
    try {
      const categoria = await CategoriaService.buscarCategoriaPorId(id);
      setFormData({
        nome: categoria.nome || '',
        descricao: categoria.descricao || ''
      });
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      alert('Erro ao carregar categoria');
      navigate('/admin/produtos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      newErrors.nome = 'Nome da categoria é obrigatório';
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
      if (id) {
        // Edição
        await CategoriaService.atualizarCategoria(id, formData);
        setSubmitStatus({
          type: 'success',
          message: 'Categoria atualizada com sucesso!'
        });
      } else {
        // Criação
        await CategoriaService.criarCategoria(formData);
        setSubmitStatus({
          type: 'success',
          message: 'Categoria criada com sucesso!'
        });
      }

      // Limpar formulário após sucesso (apenas se for criação)
      if (!id) {
        setFormData({
          nome: '',
          descricao: ''
        });
      }

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/admin/produtos');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Erro ao salvar categoria. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <nav className="mb-8">
          <Link
            to="/admin/produtos"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar para Gerenciamento
          </Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header do Formulário */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TagIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {id ? 'Editar Categoria' : 'Nova Categoria'}
                </h1>
                <p className="text-purple-100">
                  {id ? 'Atualize os dados da categoria' : 'Adicione uma nova categoria de produtos'}
                </p>
              </div>
            </div>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome da Categoria */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria *
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
                placeholder="Ex: Rock Clássico, Jazz, MPB..."
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Descreva a categoria, tipos de produtos que se encaixam..."
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {id ? 'Atualizando...' : 'Cadastrando...'}
                  </>
                ) : (
                  id ? 'Atualizar Categoria' : 'Cadastrar Categoria'
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/produtos')}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
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

export default CategoriaCadastro;