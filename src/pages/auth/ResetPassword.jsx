import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/AuthService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const validate = async () => {
      setValidating(true);
      setError("");
      try {
        const res = await authService.validateResetToken(token);
        if (res.success && res.data?.valid) {
          setIsValid(true);
          setEmail(res.data?.email || "");
        } else {
          setIsValid(false);
          setError(res.message || "Token inválido ou expirado");
        }
      } catch (err) {
        setIsValid(false);
        setError("Token inválido ou expirado");
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await authService.resetPassword({ token, novaSenha });
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Falha ao redefinir a senha");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validando link...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Link inválido
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Este link de redefinição não é válido ou expirou."}
          </p>
          <Link
            to="/forgot-password"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Redefinir senha
        </h1>
        {email && (
          <p className="text-sm text-gray-600 mb-6">
            Para: <span className="font-medium">{email}</span>
          </p>
        )}
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
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Nova senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
              placeholder="Mínimo de 6 caracteres"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Confirmar nova senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-600"
              placeholder="Repita a nova senha"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Redefinindo..." : "Redefinir senha"}
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

export default ResetPassword;
