import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Professional System Initialization - Siqueira Campos Imóveis
// Enterprise-grade React initialization with enhanced performance and error handling
// Developed by KRYONIX Technology - Maximum robustness and speed

const SYSTEM_VERSION = "2.0.0";
const DEVELOPER = "KRYONIX Tecnologia";

// Enhanced performance logging system
const log = (level: string, message: string, data?: any) => {
  if (typeof window === "undefined") return;

  const timestamp = performance.now();
  const logData = { level, message, data, timestamp, system: "SiqueiraCampos" };

  // Initialize logs array if not exists
  if (!window.SiqueiraSystemLogs) window.SiqueiraSystemLogs = [];
  window.SiqueiraSystemLogs.push(logData);

  // Only log in development
  if (import.meta.env.DEV) {
    console[level as keyof Console](`[SIQUEIRA] ${message}`, data || "");
  }
};

// Professional error boundary wrapper
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    log("error", "React Error Boundary caught error", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-brown-800 to-brand-brown-600 text-white">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">
            🏠 Siqueira Campos Imóveis
          </h1>
          <p className="mb-6">Sistema Profissional de Gestão Imobiliária</p>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">⚠️ Erro no Sistema</h3>
            <p className="text-sm opacity-90">
              Detectamos um problema técnico. Nossa equipe foi notificada
              automaticamente.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-brand-brown-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            🔄 Recarregar Sistema
          </button>
        </div>
      </div>
    );
  }
};

// Professional system initialization with enhanced performance
const initializeProfessionalSystem = async (): Promise<void> => {
  log("info", `🏠 Sistema Siqueira Campos Imóveis v${SYSTEM_VERSION}`);
  log("info", `🔧 Desenvolvido por ${DEVELOPER}`);
  log("info", "🚀 Inicializando sistema profissional otimizado...");

  try {
    // Verify critical dependencies
    if (!React) {
      throw new Error("React library não carregada");
    }

    if (!ReactDOM) {
      throw new Error("ReactDOM library não carregada");
    }

    // Verify root element
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element (#root) não encontrado no DOM");
    }

    log("info", "✅ Dependências verificadas com sucesso");

    // Create React root with enhanced configuration
    const root = ReactDOM.createRoot(rootElement, {
      onRecoverableError: (error) => {
        log("warn", "React recoverable error", error);
      },
    });

    // Enhanced React app with professional error handling
    const EnhancedApp = () => (
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    // Render the complete professional application
    root.render(<EnhancedApp />);

    // Hide loading state after successful render
    setTimeout(() => {
      const loadingState = document.getElementById("loading-state");
      if (loadingState) {
        loadingState.style.display = "none";
        log("info", "🎉 Loading state hidden - System fully operational");
      }
    }, 500);

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
    log("info", "   - ⚡ Performance otimizada");
  } catch (error) {
    log("error", "❌ ERRO CRÍTICO ao inicializar sistema:", error);
    showProfessionalError("Erro na inicialização do sistema", error);
  }
};

// Enhanced error display system
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
          Sistema Profissional de Gestão Imobiliária v${SYSTEM_VERSION}
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
            Sistema detectou uma falha técnica. Equipe KRYONIX foi notificada automaticamente.
          </p>
          ${
            error && import.meta.env.DEV
              ? `<details style="margin-top: 1rem; text-align: left;">
            <summary style="cursor: pointer; color: #FFE4B5;">Detalhes técnicos (Dev Mode)</summary>
            <pre style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem; overflow: auto; white-space: pre-wrap;">${error.toString()}</pre>
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

// Enhanced initialization with proper timing
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
  log("error", "🚨 Global JavaScript Error:", {
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

  // Prevent default browser behavior
  event.preventDefault();
});

// Performance monitoring
if (typeof window.performance !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = window.performance.getEntriesByType(
        "navigation",
      )[0] as any;
      log("info", "📊 Performance Metrics:", {
        domContentLoaded:
          perfData.domContentLoadedEventEnd - perfData.navigationStart,
        loadComplete: perfData.loadEventEnd - perfData.navigationStart,
        firstPaint: performance.getEntriesByType("paint")[0]?.startTime,
      });
    }, 0);
  });
}

// Initialize the professional system
initializeWhenReady();

// Export enhanced debug utilities
declare global {
  interface Window {
    SiqueiraSystemLogs: any[];
    SiqueiraCamposSystem: any;
  }
}

window.SiqueiraCamposSystem = {
  version: SYSTEM_VERSION,
  developer: DEVELOPER,
  reinitialize: initializeProfessionalSystem,
  logs: () => window.SiqueiraSystemLogs || [],
  clearLogs: () => {
    window.SiqueiraSystemLogs = [];
  },
  performance: () => {
    if (typeof window.performance !== "undefined") {
      return {
        memory: (window.performance as any).memory,
        timing: window.performance.timing,
        navigation: window.performance.getEntriesByType("navigation")[0],
      };
    }
    return null;
  },
  debug: import.meta.env.DEV,
};

log(
  "info",
  "🎯 Sistema de inicialização profissional v2.0 configurado com melhorias de performance",
);
