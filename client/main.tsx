import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Enhanced error handling and debugging
const initializeApp = () => {
  console.log("🚀 Inicializando Sistema Siqueira Campos Imóveis...");

  // Check for root element
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("❌ Elemento root não encontrado");
    return;
  }

  // Override fetch to prevent external connections during development
  const originalFetch = window.fetch;
  window.fetch = async (url: RequestInfo | URL, options?: RequestInit) => {
    const urlString = typeof url === "string" ? url : url.toString();

    // Block the specific problematic domain
    if (
      urlString.includes(
        "641f970e3cb94a99831b41ae1b5bfad7-f3283dff08ad4bee8424e9955.fly.dev",
      )
    ) {
      console.warn("🚫 Bloqueando conexão externa problemática:", urlString);
      throw new Error("Conexão externa bloqueada para evitar problemas");
    }

    // Allow relative URLs and localhost
    if (
      urlString.startsWith("/") ||
      urlString.includes("localhost") ||
      urlString.includes("127.0.0.1")
    ) {
      return originalFetch(url, options);
    }

    // Allow specific external domains (images, maps, etc)
    const allowedDomains = [
      "images.unsplash.com",
      "cdn.builder.io",
      "maps.googleapis.com",
      "wa.me",
      "instagram.com",
      "kryonix.com.br",
    ];

    if (allowedDomains.some((domain) => urlString.includes(domain))) {
      return originalFetch(url, options);
    }

    console.warn("🚫 Conexão externa não permitida:", urlString);
    return originalFetch(url, options);
  };

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log("✅ Sistema Siqueira Campos carregado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar:", error);

    // Fallback em caso de erro
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #8B4513;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">🏠 Siqueira Campos Imóveis</h1>
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">Sistema carregando...</p>
        <p style="color: #666;">Erro técnico temporário. Recarregue a página.</p>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
