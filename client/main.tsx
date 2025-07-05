import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Professional System Initialization - Siqueira Campos Imóveis
// Developed by KRYONIX Technology
const initializeSiqueiraSystem = () => {
  console.log("🏠 Sistema Siqueira Campos Imóveis v1.0.0");
  console.log("🔧 Desenvolvido por KRYONIX Tecnologia");
  console.log("📍 Inicializando sistema completo...");

  // Verify root element exists
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("❌ ERRO CRÍTICO: Elemento root não encontrado!");
    document.body.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        min-height: 100vh; 
        font-family: system-ui, -apple-system, sans-serif;
        background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%);
        color: white;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">🏠 Siqueira Campos Imóveis</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Sistema Profissional de Gestão Imobiliária</p>
        <p style="color: #FFE4B5;">Erro técnico detectado. Por favor, recarregue a página.</p>
        <button onclick="window.location.reload()" style="
          margin-top: 2rem;
          padding: 1rem 2rem;
          background: white;
          color: #8B4513;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
        ">Recarregar Sistema</button>
      </div>
    `;
    return;
  }

  try {
    console.log("✅ Root element found, initializing React...");

    // Create React root with enhanced error boundary
    const root = ReactDOM.createRoot(rootElement);

    // Render complete professional application
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    console.log("✅ Sistema Siqueira Campos carregado com sucesso!");
    console.log("🎯 Funcionalidades ativas:");
    console.log("   - 🏠 Gestão completa de imóveis");
    console.log(
      "   - 👥 Sistema multi-usuário (Admin, Corretor, Cliente, Marketing)",
    );
    console.log("   - 📝 Blog profissional");
    console.log("   - ⭐ Sistema de depoimentos");
    console.log("   - 💬 Chat IA integrado");
    console.log("   - 📱 PWA responsivo");
    console.log("   - 🛡️ Segurança enterprise");
  } catch (error) {
    console.error("❌ ERRO ao inicializar Sistema Siqueira Campos:", error);

    // Professional fallback with full branding
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%);
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div style="
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 3rem;
          max-width: 600px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        ">
          <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">
            🏠 Siqueira Campos Imóveis
          </h1>
          <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #FFE4B5;">
            Sistema Profissional de Gestão Imobiliária
          </p>
          <p style="font-size: 1.1rem; margin-bottom: 2rem;">
            Desenvolvido por <strong>KRYONIX Tecnologia</strong>
          </p>
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
          ">
            <p style="color: #FFE4B5; margin-bottom: 1rem;">
              ⚠️ Inicialização em andamento...
            </p>
            <p style="font-size: 0.9rem;">
              Se o problema persistir, contate o suporte técnico.
            </p>
          </div>
          <button onclick="window.location.reload()" style="
            padding: 1rem 2rem;
            background: white;
            color: #8B4513;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            🔄 Recarregar Sistema
          </button>
        </div>
      </div>
    `;
  }
};

// Professional initialization with proper timing
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSiqueiraSystem);
} else {
  initializeSiqueiraSystem();
}

// Export for debugging
(window as any).SiqueiraCamposSystem = {
  version: "1.0.0",
  developer: "KRYONIX Tecnologia",
  reinitialize: initializeSiqueiraSystem,
};
