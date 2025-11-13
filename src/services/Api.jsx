// src/services/api.js (versão corrigida)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request simplificado - SEM token por padrão
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Fazendo requisição para: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Erro na configuração da requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor de response simplificado - SEM redirecionamentos automáticos
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Resposta recebida de: ${response.config.url}`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error("❌ Erro na resposta:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    // Não redireciona automaticamente, só loga o erro
    return Promise.reject(error);
  }
);


export default api;
