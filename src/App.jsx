// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Adicione outras rotas aqui posteriormente */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;