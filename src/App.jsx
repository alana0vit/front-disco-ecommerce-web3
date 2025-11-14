// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroCliente from "./pages/cliente/Cadastro";
import Perfil from "./pages/cliente/Perfil";
import Produtos from "./pages/produto/Produtos";
import ProdutoCreate from "./pages/produto/ProdutoCadastro";
import ProdutoDetalhes from "./pages/produto/ProdutoDetalhes";
import AdminProdutos from "./pages/produto/AdminProdutos";
import AdminCategorias from "./pages/categoria/AdminCategoria";
import CategoriaCadastro from "./pages/categoria/CadastroCategoria";
import CadastroEndereco from "./pages/cliente/Endereco";
import Carrinho from "./pages/carrinho/Carrinho";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CadastroCliente />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route
              path="/perfil/enderecos/novo"
              element={<CadastroEndereco />}
            />
            <Route path="/carrinho" element={<Carrinho />} />

            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/show/:id" element={<ProdutoDetalhes />} />
            {/* rotas de adm */}
            <Route path="/admin/produtos/novo" element={<ProdutoCreate />} />
            <Route path="/admin/produtos" element={<AdminProdutos />} />
            <Route path="/admin/categorias" element={<AdminCategorias />} />
            <Route
              path="/admin/categorias/nova"
              element={<CategoriaCadastro />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
