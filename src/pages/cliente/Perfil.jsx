// src/pages/Profile.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import EnderecoService from '../../services/Endereco';

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(false);
  
  // Dados mockados - depois virão do contexto/API
  const [clientData, setClientData] = useState({
    idCliente: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    dataNasc: '1990-01-01',
    dataCadastro: '2024-01-01',
    ativo: true
  });

  const [formData, setFormData] = useState({ ...clientData });

  // Carregar endereços
  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    setCarregandoEnderecos(true);
    try {
      // Para teste, vamos buscar todos os endereços e filtrar pelo cliente
      const todosEnderecos = await EnderecoService.listarEnderecos();
      const enderecosCliente = todosEnderecos.filter(
        endereco => endereco.cliente.idCliente === clientData.idCliente
      );
      setEnderecos(enderecosCliente);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      alert('Erro ao carregar endereços');
    } finally {
      setCarregandoEnderecos(false);
    }
  };

  const handleExcluirEndereco = async (idEndereco) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }

    try {
      await EnderecoService.excluirEndereco(idEndereco);
      alert('Endereço excluído com sucesso!');
      carregarEnderecos(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      alert(error.message);
    }
  };

  const handleDefinirPadrao = async (idEndereco) => {
    try {
      await EnderecoService.definirComoPadrao(idEndereco);
      alert('Endereço definido como padrão!');
      carregarEnderecos(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao definir endereço como padrão:', error);
      alert(error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...clientData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...clientData });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular atualização na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClientData(formData);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatEndereco = (endereco) => {
    return `${endereco.rua}, ${endereco.numCasa} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais e endereços
          </p>
        </div>

        {/* Informações do Perfil */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Header do Perfil */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {clientData.nome}
                </h2>
                <p className="text-purple-100">
                  Cliente desde {formatDate(clientData.dataCadastro)}
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Informações do Perfil */}
          <div className="p-6">
            {!isEditing ? (
              // Modo Visualização
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Nome completo
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {clientData.nome}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      E-mail
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {clientData.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Telefone
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {clientData.telefone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Data de Nascimento
                    </label>
                    <p className="mt-1 text-lg text-gray-900">
                      {formatDate(clientData.dataNasc)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleEdit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Editar Perfil
                  </button>
                  
                  <Link
                    to="/pedidos"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Meus Pedidos
                  </Link>
                </div>
              </div>
            ) : (
              // Modo Edição
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dataNasc"
                        value={formData.dataNasc}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckIcon className="h-5 w-5 mr-2" />
                    )}
                    Salvar Alterações
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Endereços - Agora na parte de baixo */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Meus Endereços
              </h3>
            </div>
          </div>

          <div className="p-6">
            {carregandoEnderecos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando endereços...</p>
              </div>
            ) : enderecos.length === 0 ? (
              <div className="text-center py-8">
                <MapPinIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-lg">Nenhum endereço cadastrado</p>
                <p className="text-gray-400 text-sm mb-6">
                  Adicione seu primeiro endereço para facilitar suas compras
                </p>
                <Link
                  to="/perfil/enderecos/novo"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Cadastrar Primeiro Endereço
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enderecos.map((endereco) => (
                  <div
                    key={endereco.idEndereco}
                    className={`border rounded-lg p-4 ${
                      endereco.padrao 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {endereco.padrao && (
                          <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">
                          {endereco.padrao ? 'Endereço Padrão' : 'Endereço'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {!endereco.padrao && (
                          <button
                            onClick={() => handleDefinirPadrao(endereco.idEndereco)}
                            className="text-yellow-600 hover:text-yellow-700 p-1"
                            title="Definir como padrão"
                          >
                            <StarIcon className="h-4 w-4" />
                          </button>
                        )}
                        <Link
                          to={`/perfil/enderecos/editar/${endereco.idEndereco}`}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Editar endereço"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleExcluirEndereco(endereco.idEndereco)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Excluir endereço"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {formatEndereco(endereco)}
                      </p>
                      {endereco.complemento && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Complemento:</span> {endereco.complemento}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">CEP:</span> {endereco.cep}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {enderecos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/perfil/enderecos/novo"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors w-full md:w-auto"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar Novo Endereço
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;