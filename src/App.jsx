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
import ProdutoEdicao from "./pages/produto/ProdutoEdicao";
import AdminCategorias from "./pages/categoria/AdminCategoria";
import CategoriaCadastro from "./pages/categoria/CadastroCategoria";
import CadastroEndereco from "./pages/cliente/Endereco";
import EditarEndereco from "./pages/cliente/EditarEndereco";
import Carrinho from "./pages/carrinho/Carrinho";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="grow">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CadastroCliente />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/show/:id" element={<ProdutoDetalhes />} />

            {/* Rotas protegidas (requer login) */}
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil/enderecos/novo"
              element={
                <ProtectedRoute>
                  <CadastroEndereco />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil/enderecos/editar/:id"
              element={
                <ProtectedRoute>
                  <EditarEndereco />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrinho"
              element={
                <ProtectedRoute>
                  <Carrinho />
                </ProtectedRoute>
              }
            />

            {/* Rotas de administrador */}
            <Route
              path="/admin/produtos/novo"
              element={
                <AdminRoute>
                  <ProdutoCreate />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/produtos"
              element={
                <AdminRoute>
                  <AdminProdutos />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <AdminRoute>
                  <AdminCategorias />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categorias/nova"
              element={
                <AdminRoute>
                  <CategoriaCadastro />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/produtos/editar/:id"
              element={
                <AdminRoute>
                  <ProdutoEdicao />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
