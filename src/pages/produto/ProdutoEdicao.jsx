// src/pages/produto/ProdutoEdicao.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { productService, categoryService } from "../../services/Produto";

const ProdutoEdicao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    ativo: 1,
    imagem: null,
    id_categoria_prod: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  // Carregar produto e categorias
  useEffect(() => {
    loadProductAndCategories();
  }, [id]);

  const loadProductAndCategories = async () => {
    try {
      setLoadingProduct(true);
      const [productData, categoriesData] = await Promise.all([
        productService.getProductById(id),
        categoryService.getCategories()
      ]);

      setCategories(categoriesData);
      
      // Preencher formulário com dados do produto
      setFormData({
        nome: productData.nome || "",
        descricao: productData.descricao || "",
        preco: productData.preco?.toString() || "",
        estoque: productData.estoque?.toString() || "",
        ativo: productData.ativo ? 1 : 0,
        imagem: null, // Não carregamos o arquivo, apenas a URL
        id_categoria_prod: productData.categoria?.idCategoria?.toString() || "",
      });

      // Salvar dados originais para comparação
      setOriginalData(productData);

      // Configurar preview da imagem existente
      if (productData.imagemUrl) {
        setImagePreview(productData.imagemUrl);
      }

    } catch (err) {
      console.error("Error loading product:", err);
      setSubmitStatus({
        type: "error",
        message: "Erro ao carregar produto",
      });
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          imagem: "Apenas imagens JPG, PNG ou WebP são permitidas",
        }));
        return;
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imagem: "A imagem deve ter no máximo 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imagem: file,
      }));

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Limpar erro
      if (errors.imagem) {
        setErrors((prev) => ({
          ...prev,
          imagem: "",
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imagem: null,
    }));
    setImagePreview(originalData?.imagemUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome do produto é obrigatório";
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = "Preço deve ser maior que zero";
    }

    if (!formData.estoque || parseInt(formData.estoque) < 0) {
      newErrors.estoque = "Estoque não pode ser negativo";
    }

    if (!formData.id_categoria_prod) {
      newErrors.id_categoria_prod = "Categoria é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Por favor, corrija os erros no formulário",
      });
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      // Criar FormData para enviar (suporta tanto JSON quanto arquivo)
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("descricao", formData.descricao);
      formDataToSend.append("preco", parseFloat(formData.preco));
      formDataToSend.append("estoque", parseInt(formData.estoque));
      formDataToSend.append("ativo", formData.ativo);
      formDataToSend.append(
        "id_categoria_prod",
        parseInt(formData.id_categoria_prod)
      );

      // Adicionar imagem apenas se foi selecionada uma nova
      if (formData.imagem) {
        formDataToSend.append("imagem", formData.imagem);
      }

      await productService.updateProduct(id, formDataToSend);

      setSubmitStatus({
        type: "success",
        message: "Produto atualizado com sucesso!",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/produtos");
      }, 2000);

    } catch (err) {
      console.error("Error updating product:", err);
      setSubmitStatus({
        type: "error",
        message: "Erro ao atualizar produto. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar se houve mudanças no formulário
  const hasChanges = () => {
    if (!originalData) return false;

    return (
      formData.nome !== originalData.nome ||
      formData.descricao !== (originalData.descricao || "") ||
      parseFloat(formData.preco) !== parseFloat(originalData.preco) ||
      parseInt(formData.estoque) !== parseInt(originalData.estoque) ||
      formData.ativo !== (originalData.ativo ? 1 : 0) ||
      formData.id_categoria_prod !== (originalData.categoria?.idCategoria?.toString() || "") ||
      formData.imagem !== null
    );
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!originalData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Produto não encontrado
            </h2>
            <Link
              to="/produtos"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Editar Produto
            </h1>
            <p className="text-purple-100">
              Atualize as informações do disco na coleção da discool
            </p>
          </div>

          {/* Alert de Status */}
          {submitStatus && (
            <div
              className={`mx-6 mt-6 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {submitStatus.type === "success" ? (
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
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                      errors.nome ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ex: The Dark Side of the Moon"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label
                    htmlFor="id_categoria_prod"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categoria *
                  </label>
                  <select
                    id="id_categoria_prod"
                    name="id_categoria_prod"
                    value={formData.id_categoria_prod}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                      errors.id_categoria_prod
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option
                        key={category.idCategoria}
                        value={category.idCategoria}
                      >
                        {category.nome}
                      </option>
                    ))}
                  </select>
                  {errors.id_categoria_prod && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.id_categoria_prod}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="ativo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Status do Produto
                  </label>
                  <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                    <input
                      type="checkbox"
                      id="ativo"
                      name="ativo"
                      checked={formData.ativo === 1}
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
                  <label
                    htmlFor="preco"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      R$
                    </span>
                    <input
                      type="number"
                      id="preco"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                        errors.preco ? "border-red-500" : "border-gray-300"
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
                  <label
                    htmlFor="estoque"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                      errors.estoque ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Quantidade em estoque"
                  />
                  {errors.estoque && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.estoque}
                    </p>
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
                <label
                  htmlFor="descricao"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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

            {/* Upload de Imagem */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Imagem do Produto
              </h2>

              <div className="space-y-4">
                {/* Área de Upload */}
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <div>
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Clique para fazer upload de uma nova imagem
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, WebP até 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mensagem de Erro */}
                {errors.imagem && (
                  <p className="text-sm text-red-600">{errors.imagem}</p>
                )}

                {/* Informações */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Deixe em branco para manter a imagem atual. 
                    Use imagens quadradas (1:1) para melhor visualização. 
                    Tamanho recomendado: 500x500 pixels.
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || !hasChanges()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Atualizando...
                  </>
                ) : (
                  "Atualizar Produto"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/produtos")}
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

export default ProdutoEdicao;