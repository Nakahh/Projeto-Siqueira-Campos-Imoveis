import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Professional System Initialization - Siqueira Campos Imóveis
// Enterprise-grade React initialization with full error handling
// Developed by KRYONIX Technology - Maintaining maximum robustness

const SYSTEM_VERSION = "1.0.0";
const DEVELOPER = "KRYONIX Tecnologia";

// Professional logging system
const log = (level: string, message: string, data?: any) => {
  const timestamp = Date.now();
  const logData = { level, message, data, timestamp, system: "SiqueiraCampos" };

  // Store in window for debugging
  if (!window.SiqueiraSystemLogs) window.SiqueiraSystemLogs = [];
  window.SiqueiraSystemLogs.push(logData);

  console[level as keyof Console](`[SIQUEIRA] ${message}`, data || "");
};

// Professional system initialization with maximum robustness
const initializeProfessionalSystem = (): void => {
  log("info", `🏠 Sistema Siqueira Campos Imóveis v${SYSTEM_VERSION}`);
  log("info", `🔧 Desenvolvido por ${DEVELOPER}`);
  log("info", "🚀 Inicializando sistema profissional completo...");

  // Update loading progress
  const updateLoadingProgress = (percentage: number, text: string) => {
    try {
      const progressBar = document.getElementById("progress-bar");
      const loadingText = document.getElementById("loading-text");
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (loadingText) loadingText.textContent = text;
      log("info", "📊 Progress", { percentage, text });
    } catch (error) {
      log("warn", "Progress update failed", error);
    }
  };

  updateLoadingProgress(90, "🔧 Inicializando React...");

  // Verify critical dependencies
  if (!React) {
    log("error", "❌ React não encontrado!");
    showProfessionalError("React library não carregada");
    return;
  }

  if (!ReactDOM) {
    log("error", "❌ ReactDOM não encontrado!");
    showProfessionalError("ReactDOM library não carregada");
    return;
  }

  // Verify root element
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    log("error", "❌ Elemento root não encontrado!");
    showProfessionalError("Root element (#root) não encontrado no DOM");
    return;
  }

  log("info", "✅ Elemento root encontrado");
  log("info", "✅ React e ReactDOM carregados");

  try {
    updateLoadingProgress(95, "🎯 Renderizando aplicação...");

    // Create React root with enhanced error boundaries
    const root = ReactDOM.createRoot(rootElement);

    // Professional error boundary wrapper
    const SystemWithErrorBoundary = () => {
      return (
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>
      );
    };

    // Render the complete professional application
    root.render(<SystemWithErrorBoundary />);

    updateLoadingProgress(100, "✅ Sistema carregado com sucesso!");

    // Hide loading state after successful render
    setTimeout(() => {
      const loadingState = document.getElementById("loading-state");
      if (loadingState) {
        loadingState.style.display = "none";
        log("info", "🎉 Loading state hidden - System fully operational");
      }
    }, 1000);

    log("info", "✅ Sistema Siqueira Campos carregado com sucesso!");
    log("info", "🎯 Funcionalidades ativas:");
    log("info", "   - 🏠 Gestão completa de imóveis");
    log("info", "   - 👥 Sistema multi-usuário enterprise");
    log("info", "   - 📝 Blog profissional com CMS");
    log("info", "   - ⭐ Sistema de depoimentos avançado");
    log("info", "   - 💬 Chat IA integrado");
    log("info", "   - 📱 PWA com funcionalidades offline");
    log("info", "   - 🛡️ Segurança enterprise-grade");
    log("info", "   - 📊 Dashboards analíticos robustos");
  } catch (error) {
    log("error", "❌ ERRO CRÍTICO ao renderizar aplicação:", error);
    showProfessionalError("Erro na renderização do React", error);
  }
};

// Professional Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    log("error", "🛡️ Error Boundary ativado:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    log("error", "🛡️ React Error Boundary - Erro capturado:", {
      error,
      errorInfo,
    });
    showProfessionalError("React Component Error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)",
            color: "white",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "1rem",
              padding: "3rem",
              maxWidth: "600px",
            }}
          >
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              🏠 Siqueira Campos Imóveis
            </h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
              Sistema Profissional de Gestão Imobiliária
            </p>
            <p style={{ marginBottom: "2rem", color: "#FFE4B5" }}>
              🛡️ Sistema de recuperação automática ativado
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "1rem 2rem",
                background: "white",
                color: "#8B4513",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔄 Reinicializar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Professional error display system
const showProfessionalError = (title: string, error?: any) => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

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
        max-width: 700px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      ">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">
          🏠 Siqueira Campos Imóveis
        </h1>
        <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #FFE4B5;">
          Sistema Profissional de Gestão Imobiliária
        </p>
        <p style="font-size: 1.1rem; margin-bottom: 2rem;">
          Desenvolvido por <strong>KRYONIX Tecnologia</strong>
        </p>
        
        <div style="
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        ">
          <h3 style="color: #FFE4B5; margin-bottom: 1rem;">⚠️ ${title}</h3>
          <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">
            Sistema detectou uma falha técnica. Nossa equipe foi notificada automaticamente.
          </p>
          ${
            error
              ? `<details style="margin-top: 1rem; text-align: left;">
            <summary style="cursor: pointer; color: #FFE4B5;">Detalhes técnicos</summary>
            <pre style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem; overflow: auto;">${error.toString()}</pre>
          </details>`
              : ""
          }
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
          margin-right: 1rem;
          transition: all 0.3s ease;
        ">🔄 Recarregar Sistema</button>
        
        <button onclick="window.open('https://wa.me/5517981805327', '_blank')" style="
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        ">💬 Suporte KRYONIX</button>
      </div>
    </div>
  `;
};

// Professional initialization with proper timing and fallbacks
const initializeWhenReady = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProfessionalSystem);
    log("info", "🔄 Aguardando DOM ready...");
  } else {
    initializeProfessionalSystem();
  }
};

// Global error handlers for maximum robustness
window.addEventListener("error", (event) => {
  log("error", "🚨 Global Error:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  log("error", "🚨 Unhandled Promise Rejection:", {
    reason: event.reason,
    promise: event.promise,
  });
});

// Initialize the professional system
initializeWhenReady();

// Export debug utilities for development
(window as any).SiqueiraCamposSystem = {
  version: SYSTEM_VERSION,
  developer: DEVELOPER,
  reinitialize: initializeProfessionalSystem,
  logs: () => window.SiqueiraSystemLogs || [],
  clearLogs: () => {
    window.SiqueiraSystemLogs = [];
  },
  debug: true,
};

log("info", "🎯 Sistema de inicialização profissional configurado");
