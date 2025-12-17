// src/pages/carrinho/Carrinho.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  TicketIcon,
  UserIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useCarrinho } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import carrinhoService from "../../services/Carrinho";
import EnderecoService from "../../services/Endereco";

const Carrinho = () => {
  const { user } = useAuth();
  const {
    itens,
    removerProduto,
    atualizarQuantidade,
    limparCarrinho,
    getTotalItens,
    getTotalPreco,
  } = useCarrinho();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [frete, setFrete] = useState(0);
  const [opcoesFrete, setOpcoesFrete] = useState([]);
  const [editandoQuantidade, setEditandoQuantidade] = useState({});
  const [freteSelecionado, setFreteSelecionado] = useState("");
  const [dadosCliente, setDadosCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState(null);
  const [etapa, setEtapa] = useState("carrinho"); // 'carrinho', 'dados', 'confirmacao'
  const navigate = useNavigate();

  // Calcular totais
  const totalItens = getTotalItens();
  const subtotal = getTotalPreco();
  const total = subtotal + frete - desconto;

  // CEP do endereço selecionado (para exibir/calcular frete no resumo)
  const enderecoSelecionado = enderecos.find(
    (e) => (e.idEndereco || e.id) === enderecoSelecionadoId
  );
  const cepSelecionado = enderecoSelecionado?.cep;

  // Prefill dados do cliente e endereços ao logar
  useEffect(() => {
    if (user) {
      setDadosCliente({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
      });

      // Carrega endereços e seleciona padrão
      (async () => {
        try {
          const list = await EnderecoService.listarEnderecos();
          setEnderecos(Array.isArray(list) ? list : []);
          const padrao = list?.find?.((e) => e.padrao === true) || list?.[0];
          if (padrao) {
            setEnderecoSelecionadoId(padrao.idEndereco || padrao.id);
          }
        } catch (e) {
          // se falhar, mantém vazio
        }
      })();
    }
  }, [user]);

  // Carregar opções de frete quando itens ou endereço selecionado mudarem
  useEffect(() => {
    if (itens.length > 0 && enderecoSelecionadoId) {
      carregarOpcoesFrete();
    }
  }, [itens, enderecoSelecionadoId]);

  // Limpa estados de edição quando itens mudam
  useEffect(() => {
    setEditandoQuantidade({});
  }, [itens]);

  const carregarOpcoesFrete = async () => {
    try {
      const enderecoSel = enderecos.find(
        (e) => (e.idEndereco || e.id) === enderecoSelecionadoId
      );
      const cep = enderecoSel?.cep || "00000000";
      const opcoes = await carrinhoService.calcularFrete(cep, itens);
      setOpcoesFrete(opcoes);

      if (opcoes.length > 0) {
        setFreteSelecionado(opcoes[1].id); // Padrão
        setFrete(opcoes[1].valor);
      }
    } catch (err) {
      console.error("Erro ao carregar opções de frete:", err);
    }
  };

  const handleQuantidadeChange = async (produtoId, novaQuantidade) => {
    const quantidadeNumerica = parseInt(novaQuantidade, 10);
    
    if (isNaN(quantidadeNumerica) || quantidadeNumerica < 1) {
      return;
    }

    try {
      const item = itens.find((item) => item.id === produtoId);
      const verificacaoEstoque = await carrinhoService.verificarEstoque([
        { id: produtoId, quantidade: quantidadeNumerica },
      ]);

      if (!verificacaoEstoque[0].disponivel) {
        setError(
          `Estoque insuficiente para ${verificacaoEstoque[0].produto}. Disponível: ${verificacaoEstoque[0].estoqueDisponivel}`
        );
        return;
      }

      atualizarQuantidade(produtoId, quantidadeNumerica);
      setError(null);
    } catch (err) {
      setError("Erro ao verificar estoque");
    }
  };

  // Funções para manipulação do input de quantidade
  const handleInputQuantidadeChange = (produtoId, valor) => {
    if (valor === "") {
      setEditandoQuantidade({ ...editandoQuantidade, [produtoId]: "" });
      return;
    }

    const numValor = parseInt(valor, 10);
    
    if (isNaN(numValor) || numValor < 1) {
      return;
    }

    setEditandoQuantidade({ ...editandoQuantidade, [produtoId]: numValor });
  };

  const handleInputQuantidadeBlur = async (item) => {
    const produtoId = item.id;
    const valorAtual = editandoQuantidade[produtoId];
    
    if (valorAtual === "" || valorAtual === undefined || valorAtual === null) {
      setEditandoQuantidade({ ...editandoQuantidade, [produtoId]: undefined });
      return;
    }

    const novaQuantidade = parseInt(valorAtual, 10);

    if (isNaN(novaQuantidade) || novaQuantidade < 1) {
      setEditandoQuantidade({ ...editandoQuantidade, [produtoId]: undefined });
      return;
    }

    if (novaQuantidade === item.quantidade) {
      setEditandoQuantidade({ ...editandoQuantidade, [produtoId]: undefined });
      return;
    }

    await handleQuantidadeChange(produtoId, novaQuantidade);
    setEditandoQuantidade({ ...editandoQuantidade, [produtoId]: undefined });
  };

  const handleInputQuantidadeKeyDown = (e, item) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
    if (e.key === 'Escape') {
      setEditandoQuantidade({ ...editandoQuantidade, [item.id]: undefined });
      e.target.blur();
    }
  };

  const handleRemoverItem = (produtoId) => {
    removerProduto(produtoId);
  };

  const handleAplicarCupom = async () => {
    if (!cupom.trim()) return;

    setLoading(true);
    try {
      const cupomValido = await carrinhoService.validarCupom(cupom, subtotal);

      let valorDesconto = 0;
      if (cupomValido.tipo === "percentual") {
        valorDesconto = subtotal * (cupomValido.valor / 100);
      } else if (cupomValido.tipo === "fixo") {
        valorDesconto = cupomValido.valor;
      } else if (cupomValido.tipo === "frete_gratis") {
        setFrete(0);
        valorDesconto = 0;
      }

      setDesconto(valorDesconto);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDesconto(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFreteChange = (opcaoId) => {
    setFreteSelecionado(opcaoId);
    const opcaoSelecionada = opcoesFrete.find((opcao) => opcao.id === opcaoId);
    if (opcaoSelecionada) {
      setFrete(opcaoSelecionada.valor);
    }
  };

  const handleContinuarComprando = () => {
    navigate("/produtos");
  };

  const handleAvancarParaDados = () => {
    if (totalItens === 0) {
      setError("Adicione produtos ao carrinho antes de continuar.");
      return;
    }
    setEtapa("dados");
  };

  const handleVoltarParaCarrinho = () => {
    setEtapa("carrinho");
  };

  const handleFinalizarPedido = async () => {
    if (!user) {
      setError("Você precisa estar logado para finalizar a compra.");
      navigate("/login");
      return;
    }

    if (!dadosCliente.nome || !dadosCliente.email) {
      setError("Preencha os dados de contato.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1) Verificar estoque de todos os itens (usando estoque disponível)
      const verificacaoEstoque = await carrinhoService.verificarEstoque(itens);
      const itensSemEstoque = verificacaoEstoque.filter((i) => !i.disponivel);
      if (itensSemEstoque.length > 0) {
        const produtosSemEstoque = itensSemEstoque
          .map((i) => `${i.produto} (disp: ${i.estoqueDisponivel})`)
          .join(", ");
        setError(`Estoque insuficiente para: ${produtosSemEstoque}`);
        setLoading(false);
        return;
      }

      // 2) Resolver idCliente
      const idCliente =
        user.idCliente || user.id || user.cliente?.idCliente || null;
      if (!idCliente) {
        setError("Não foi possível identificar o cliente.");
        setLoading(false);
        return;
      }

      // 3) Obter/crear carrinho do backend e sincronizar itens locais
      const carrinho = await carrinhoService.getCarrinho(idCliente);
      const carrinhoAtual = await carrinhoService.syncLocalCartToBackend(
        idCliente,
        itens
      );

      // 4) Usar endereço selecionado
      if (!Array.isArray(enderecos) || enderecos.length === 0) {
        setError(
          "Nenhum endereço encontrado. Cadastre um endereço no seu Perfil."
        );
        setLoading(false);
        return;
      }
      const enderecoSel =
        enderecos.find(
          (e) => (e.idEndereco || e.id) === enderecoSelecionadoId
        ) || enderecos[0];
      const idEndereco = enderecoSel.idEndereco || enderecoSel.id;

      if (!idEndereco) {
        setError("Não foi possível resolver o endereço para o pedido.");
        setLoading(false);
        return;
      }

      // 5) Criar pedido (o backend monta itens a partir do carrinho)
      const pedidoData = {
        id_cliente: idCliente,
        id_endereco: idEndereco,
        descricao: `Pedido Discool - ${new Date().toLocaleString()}`,
      };
      const pedidoCriado = await carrinhoService.criarPedido(
        pedidoData,
        carrinhoAtual.idCarrinho || carrinho.idCarrinho
      );

      // 6) Limpar carrinho local e navegar para tela de pagamento
      limparCarrinho();
      navigate(`/pagamento/${pedidoCriado.idPedido}`, {
        state: {
          pedido: pedidoCriado,
          total: Number(pedidoCriado.valorTotal || total),
        },
      });
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setError(err.message || "Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Carrinho vazio
  if (itens.length === 0 && etapa === "carrinho") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Que tal explorar nossa coleção de discos incríveis?
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={handleContinuarComprando}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Continuar Comprando
              </button>
              <Link
                to="/"
                className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Etapa de dados do cliente
  if (etapa === "dados") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleVoltarParaCarrinho}
              className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar para o Carrinho
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600 mt-2">
              Preencha seus dados para continuar
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Dados Pessoais */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  Dados Pessoais
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={dadosCliente.nome}
                    onChange={(e) =>
                      setDadosCliente({ ...dadosCliente, nome: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={dadosCliente.email}
                    onChange={(e) =>
                      setDadosCliente({
                        ...dadosCliente,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={dadosCliente.telefone}
                    onChange={(e) =>
                      setDadosCliente({
                        ...dadosCliente,
                        telefone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            {/* Seleção de Endereço */}
            <div>
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  Endereço de Entrega
                </h2>
              </div>
              {enderecos.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Nenhum endereço cadastrado.
                  <button
                    onClick={() => navigate("/perfil")}
                    className="text-purple-600 hover:text-purple-700 font-semibold ml-1"
                  >
                    Cadastre um endereço no seu Perfil.
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enderecos.map((e) => {
                    const id = e.idEndereco || e.id;
                    const label = `${e.rua || ""}, ${
                      e.numCasa || e.numero || ""
                    } - ${e.bairro || ""}, ${e.cidade || ""} - ${
                      e.estado || ""
                    }`;
                    return (
                      <label
                        key={id}
                        className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="endereco"
                          value={id}
                          checked={enderecoSelecionadoId === id}
                          onChange={() => setEnderecoSelecionadoId(id)}
                          className="mt-1 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {label}
                            </span>
                            {e.padrao && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                Padrão
                              </span>
                            )}
                          </div>
                          {e.cep && (
                            <div className="text-xs text-gray-500 mt-1">
                              CEP: {e.cep}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                  <div className="text-right">
                    <button
                      onClick={() => navigate("/perfil")}
                      className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Gerenciar endereços
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Finalizar */}
            <div className="mt-8">
              <button
                onClick={handleFinalizarPedido}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  "Finalizar Pedido"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Etapa do carrinho (principal)
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
          <p className="text-gray-600 mt-2">
            {totalItens} {totalItens === 1 ? "item" : "itens"} no carrinho
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cupom de Desconto 
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <TicketIcon className="h-6 w-6 text-purple-600" />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Código do cupom"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleAplicarCupom}
                  disabled={loading || !cupom.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  {loading ? "Aplicando..." : "Aplicar"}
                </button>
              </div>
              {desconto > 0 && (
                <p className="text-green-600 text-sm mt-2">
                  Cupom aplicado! Desconto de R$ {desconto.toFixed(2)}
                </p>
              )}
            </div>*/}

            {/* Lista de Produtos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-6 border-b border-gray-100 last:border-b-0"
                >
                  {/* Imagem do Produto */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || "/api/placeholder/80/80"}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="flex-1 ml-6">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                    <p className="text-purple-600 font-bold text-lg mt-2">
                      R$ {item.price?.toFixed(2)}
                    </p>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleQuantidadeChange(item.id, item.quantidade - 1)
                      }
                      disabled={item.quantidade <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>

                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={item.stock || 999}
                        value={editandoQuantidade[item.id] !== undefined ? editandoQuantidade[item.id] : item.quantidade}
                        onChange={(e) => handleInputQuantidadeChange(item.id, e.target.value)}
                        onBlur={() => handleInputQuantidadeBlur(item)}
                        onKeyDown={(e) => handleInputQuantidadeKeyDown(e, item)}
                        onFocus={() => setEditandoQuantidade({ ...editandoQuantidade, [item.id]: item.quantidade })}
                        className="w-16 h-8 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold text-gray-900 bg-white shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    <button
                      onClick={() =>
                        handleQuantidadeChange(item.id, item.quantidade + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-150"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Subtotal e Remover */}
                  <div className="text-right ml-6">
                    <p className="font-bold text-gray-900 text-lg">
                      R$ {(item.price * item.quantidade).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoverItem(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                      title="Remover item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continuar Comprando */}
            <div className="mt-6">
              <button
                onClick={handleContinuarComprando}
                className="text-purple-600 hover:text-purple-700 font-semibold flex items-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Continuar Comprando
              </button>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItens} itens)</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>

                {/* Opções de Frete */}
                {cepSelecionado && opcoesFrete.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opções de Frete:
                    </label>
                    <div className="space-y-2">
                      {opcoesFrete.map((opcao) => (
                        <label
                          key={opcao.id}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="frete"
                            value={opcao.id}
                            checked={freteSelecionado === opcao.id}
                            onChange={(e) => handleFreteChange(e.target.value)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                {opcao.nome}
                              </span>
                              <span className="text-sm">
                                {opcao.valor === 0
                                  ? "Grátis"
                                  : `R$ ${opcao.valor.toFixed(2)}`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {opcao.prazo}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {!cepSelecionado && (
                  <div className="text-sm text-gray-500">
                    Selecione um endereço para calcular o frete
                  </div>
                )}

                {desconto > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- R$ {desconto.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAvancarParaDados}
                disabled={totalItens === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                Continuar para Pagamento
              </button>

              {/* Benefícios */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Garantia Discool de 30 dias</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Pagamento seguro</span>
                </div>
              </div>
            </div>

            {/* Limpar Carrinho */}
            <button
              onClick={limparCarrinho}
              className="w-full mt-4 text-red-500 hover:text-red-700 font-semibold text-sm flex items-center justify-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Limpar Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;