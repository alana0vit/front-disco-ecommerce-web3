// src/pages/CadastroEndereco.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import EnderecoService from '../../services/Endereco';

const CadastroEndereco = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    numCasa: '',
    complemento: '',
    estado: '',
    cep: '',
    padrao: false
  });

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    const carregarEndereco = async () => {
      if (id) {
        try {
          const endereco = await EnderecoService.buscarEnderecoPorId(id);
          setFormData({
            rua: endereco.rua || '',
            bairro: endereco.bairro || '',
            cidade: endereco.cidade || '',
            numCasa: endereco.numCasa || '',
            complemento: endereco.complemento || '',
            estado: endereco.estado || '',
            cep: endereco.cep || '',
            padrao: endereco.padrao || false
          });
        } catch (error) {
          console.error('Erro ao carregar endereço:', error);
          alert('Erro ao carregar endereço');
        }
      }
    };

    if (id) carregarEndereco();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aqui você precisaria passar o ID do cliente de alguma forma
    // Por enquanto vou usar um ID fixo para teste
    const idClienteTeste = 1;

    setLoading(true);
    try {
      if (id) {
        // Edição
        await EnderecoService.atualizarEndereco(id, formData);
        alert('Endereço atualizado com sucesso!');
      } else {
        // Criação
        await EnderecoService.criarEndereco(idClienteTeste, formData);
        alert('Endereço cadastrado com sucesso!');
      }
      navigate('/perfil/enderecos');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
            complemento: data.complemento || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/perfil/enderecos')}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar para endereços
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Editar Endereço' : 'Cadastrar Novo Endereço'}
              </h1>
              <p className="text-gray-600">
                {id ? 'Atualize os dados do seu endereço' : 'Adicione um novo endereço de entrega'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* CEP */}
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                CEP *
              </label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={(e) => {
                  handleChange(e);
                  buscarCEP(e.target.value);
                }}
                maxLength={8}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="00000000"
                required
              />
            </div>

            {/* Rua e Número */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
                  Rua *
                </label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div>
                <label htmlFor="numCasa" className="block text-sm font-medium text-gray-700">
                  Número *
                </label>
                <input
                  type="number"
                  id="numCasa"
                  name="numCasa"
                  value={formData.numCasa}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            {/* Bairro e Complemento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                  Bairro *
                </label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nome do bairro"
                  required
                />
              </div>

              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Apartamento, bloco, etc."
                />
              </div>
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nome da cidade"
                  required
                />
              </div>

              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado *
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Selecione um estado</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Endereço Padrão */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="padrao"
                name="padrao"
                checked={formData.padrao}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="padrao" className="ml-2 block text-sm text-gray-700">
                Definir como endereço padrão
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/perfil/enderecos')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (id ? 'Atualizar Endereço' : 'Cadastrar Endereço')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroEndereco;