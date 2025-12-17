import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/AuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await authService.forgotPassword({ email });
      if (res.success) {
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Falha ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Recuperar senha
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Informe seu e-mail cadastrado. Se existir em nossa base, enviaremos um
          link para redefinição de senha.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-900">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
            placeholder="seu@email.com"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
