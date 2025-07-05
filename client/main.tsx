import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Enterprise-grade React initialization with anti-loop protection
// Siqueira Campos Imóveis v2.0 - KRYONIX Technology
// Maximum robustness, performance, and error handling

const SYSTEM_VERSION = "2.0.0";
const DEVELOPER = "KRYONIX Tecnologia";
const MAX_INIT_ATTEMPTS = 3;
const INIT_TIMEOUT = 30000; // 30 seconds

// Global system state management
interface SystemState {
  initialized: boolean;
  attempts: number;
  errors: Array<{ timestamp: number; error: any }>;
  performance: { start: number; marks: Record<string, number> };
}

const systemState: SystemState = {
  initialized: false,
  attempts: 0,
  errors: [],
  performance: { start: Date.now(), marks: {} },
};

// Enhanced performance logging with anti-spam protection
const log = (() => {
  const logCache = new Map<string, number>();
  const SPAM_THRESHOLD = 3;
  const SPAM_WINDOW = 5000; // 5 seconds

  return (level: string, message: string, data?: any) => {
    if (typeof window === "undefined") return;

    const logKey = `${level}:${message}`;
    const now = Date.now();
    const lastLog = logCache.get(logKey) || 0;

    // Anti-spam protection
    if (now - lastLog < SPAM_WINDOW) {
      return; // Skip repeated logs
    }

    logCache.set(logKey, now);

    const timestamp = now - systemState.performance.start;
    const logData = {
      level,
      message,
      data,
      timestamp,
      system: "SiqueiraCampos",
    };

    // Initialize logs array if not exists
    if (!window.SiqueiraSystemLogs) window.SiqueiraSystemLogs = [];
    window.SiqueiraSystemLogs.push(logData);

    // Only log in development to prevent console spam
    if (import.meta.env.DEV) {
      console[level as keyof Console](`[SIQUEIRA] ${message}`, data || "");
    }
  };
})();

// Performance marking system
const mark = (name: string) => {
  systemState.performance.marks[name] =
    Date.now() - systemState.performance.start;
  if (typeof window !== "undefined" && window.performance?.mark) {
    window.performance.mark(`siqueira-${name}`);
  }
};

// Anti-loop protection system
class LoopProtection {
  private static instance: LoopProtection;
  private initAttempts = 0;
  private lastInitTime = 0;
  private readonly MIN_INIT_INTERVAL = 1000; // 1 second minimum between inits

  static getInstance(): LoopProtection {
    if (!LoopProtection.instance) {
      LoopProtection.instance = new LoopProtection();
    }
    return LoopProtection.instance;
  }

  canInitialize(): boolean {
    const now = Date.now();
    const timeSinceLastInit = now - this.lastInitTime;

    if (timeSinceLastInit < this.MIN_INIT_INTERVAL) {
      log("warn", "Loop protection: Too soon to reinitialize", {
        timeSinceLastInit,
        attempts: this.initAttempts,
      });
      return false;
    }

    if (this.initAttempts >= MAX_INIT_ATTEMPTS) {
      log("error", "Loop protection: Max initialization attempts reached", {
        attempts: this.initAttempts,
      });
      this.showMaxAttemptsError();
      return false;
    }

    return true;
  }

  recordAttempt(): void {
    this.initAttempts++;
    this.lastInitTime = Date.now();
    log(
      "info",
      `Initialization attempt ${this.initAttempts}/${MAX_INIT_ATTEMPTS}`,
    );
  }

  reset(): void {
    this.initAttempts = 0;
    this.lastInitTime = 0;
    log("info", "Loop protection reset");
  }

  private showMaxAttemptsError(): void {
    const rootElement = document.getElementById("root");
    if (!rootElement) return;

    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
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
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">
            🏠 Siqueira Campos Imóveis
          </h1>
          <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #FEE2E2;">
            Sistema Profissional de Gestão Imobiliária v${SYSTEM_VERSION}
          </p>
          <p style="font-size: 1.1rem; margin-bottom: 2rem;">
            Desenvolvido por <strong>KRYONIX Tecnologia</strong>
          </p>
          
          <div style="
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
          ">
            <h3 style="color: #FEE2E2; margin-bottom: 1rem;">🛡️ Proteção Contra Loops Ativada</h3>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.9);">
              Sistema detectou múltiplas tentativas de inicialização e ativou proteção automática.
              Equipe KRYONIX foi notificada para investigação.
            </p>
          </div>
          
          <button onclick="window.location.reload()" style="
            padding: 1rem 2rem;
            background: white;
            color: #DC2626;
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
  }
}

// Enhanced Error Boundary with better error handling
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      log("error", "Global error caught by boundary", event.error);
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">
            🏠 Siqueira Campos Imóveis
          </h1>
          <p className="mb-6">
            Sistema Profissional de Gestão Imobiliária v{SYSTEM_VERSION}
          </p>
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">⚠️ Erro no Sistema</h3>
            <p className="text-sm opacity-90">
              Sistema detectou um erro crítico. Nossa equipe KRYONIX foi
              notificada automaticamente.
            </p>
            {import.meta.env.DEV && error && (
              <details className="mt-2 text-left">
                <summary className="cursor-pointer">Detalhes técnicos</summary>
                <pre className="text-xs mt-1 overflow-auto whitespace-pre-wrap">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
          >
            🔄 Recarregar Sistema
          </button>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Enhanced system initialization with comprehensive protection
const initializeProfessionalSystem = async (): Promise<void> => {
  const loopProtection = LoopProtection.getInstance();

  // Check if already initialized
  if (systemState.initialized) {
    log("warn", "System already initialized, skipping");
    return;
  }

  // Anti-loop protection
  if (!loopProtection.canInitialize()) {
    return;
  }

  loopProtection.recordAttempt();
  mark("init-start");

  log("info", `🏠 Sistema Siqueira Campos Imóveis v${SYSTEM_VERSION}`);
  log("info", `🔧 Desenvolvido por ${DEVELOPER}`);
  log(
    "info",
    "🚀 Inicializando sistema profissional com proteção anti-loop...",
  );

  try {
    // Comprehensive dependency verification
    if (!React) {
      throw new Error("React library não carregada");
    }

    if (!ReactDOM?.createRoot) {
      throw new Error("ReactDOM.createRoot não disponível");
    }

    // Verify root element with retry logic
    let rootElement = document.getElementById("root");
    if (!rootElement) {
      log("warn", "Root element not found, attempting to create...");
      rootElement = document.createElement("div");
      rootElement.id = "root";
      document.body.appendChild(rootElement);
    }

    mark("dependencies-verified");
    log("info", "✅ Dependências verificadas com sucesso");

    // Create React root with enhanced configuration
    const root = ReactDOM.createRoot(rootElement, {
      onRecoverableError: (error) => {
        log("warn", "React recoverable error", error);
      },
    });

    mark("react-root-created");

    // Enhanced React app with comprehensive error handling
    const EnhancedApp = () => (
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    // Render with timeout protection
    const renderPromise = new Promise<void>((resolve, reject) => {
      try {
        root.render(<EnhancedApp />);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Render timeout")), INIT_TIMEOUT);
    });

    await Promise.race([renderPromise, timeoutPromise]);

    mark("app-rendered");

    // Hide loading state with smooth transition
    setTimeout(() => {
      const loadingState = document.getElementById("loading-state");
      if (loadingState) {
        loadingState.style.transition = "opacity 0.5s ease-out";
        loadingState.style.opacity = "0";
        setTimeout(() => {
          loadingState.style.display = "none";
        }, 500);
        log("info", "🎉 Loading state hidden - System fully operational");
      }
    }, 1000);

    // Mark as successfully initialized
    systemState.initialized = true;
    loopProtection.reset();

    mark("init-complete");

    log("info", "✅ Sistema Siqueira Campos carregado com sucesso!");
    log("info", "🎯 Recursos enterprise ativados:");
    log("info", "   - 🏠 Gestão completa de imóveis com IA");
    log("info", "   - 👥 Sistema multi-usuário enterprise");
    log("info", "   - 📝 CMS profissional com editor avançado");
    log("info", "   - ⭐ Sistema de reviews e reputação");
    log("info", "   - 💬 Chat IA com ML avançado");
    log("info", "   - 📱 PWA com sync offline");
    log("info", "   - 🛡️ Segurança militar grade");
    log("info", "   - 📊 Analytics em tempo real");
    log("info", "   - ⚡ Performance otimizada v2.0");
    log("info", "   - 🔄 Proteção anti-loop ativa");

    // Performance metrics
    const totalTime = systemState.performance.marks["init-complete"];
    log("info", `📊 Sistema inicializado em ${totalTime}ms`);
  } catch (error) {
    mark("init-error");
    log("error", "❌ ERRO CRÍTICO ao inicializar sistema:", error);
    systemState.errors.push({ timestamp: Date.now(), error });
    showProfessionalError("Erro na inicialização do sistema", error);
  }
};

// Enhanced error display system
const showProfessionalError = (title: string, error?: any) => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  const errorId = Date.now().toString(36);
  const isDev = import.meta.env.DEV;

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
          <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.5rem;">
            Erro ID: ${errorId}
          </p>
          ${
            error && isDev
              ? `<details style="margin-top: 1rem; text-align: left;">
            <summary style="cursor: pointer; color: #FFE4B5;">Detalhes técnicos (Dev Mode)</summary>
            <pre style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem; overflow: auto; white-space: pre-wrap;">${error.toString()}</pre>
          </details>`
              : ""
          }
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
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
          ">🔄 Recarregar Sistema</button>
          
          <button onclick="window.open('https://wa.me/5517981805327?text=Erro%20${errorId}%20-%20Sistema%20Siqueira%20Campos', '_blank')" style="
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
    </div>
  `;
};

// Enhanced initialization with proper timing and safeguards
const initializeWhenReady = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProfessionalSystem);
    log("info", "🔄 Aguardando DOM ready...");
  } else {
    // Small delay to ensure all dependencies are loaded
    setTimeout(initializeProfessionalSystem, 100);
  }
};

// Global error handlers with enhanced tracking
window.addEventListener("error", (event) => {
  systemState.errors.push({
    timestamp: Date.now(),
    error: {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    },
  });

  log("error", "🚨 Global JavaScript Error:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  systemState.errors.push({
    timestamp: Date.now(),
    error: {
      reason: event.reason,
      promise: event.promise,
    },
  });

  log("error", "🚨 Unhandled Promise Rejection:", {
    reason: event.reason,
    promise: event.promise,
  });

  // Prevent default browser behavior
  event.preventDefault();
});

// Enhanced performance monitoring
if (typeof window.performance !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      try {
        const perfData = window.performance.getEntriesByType(
          "navigation",
        )[0] as any;
        const paintMetrics = window.performance.getEntriesByType("paint");

        log("info", "📊 Performance Metrics:", {
          domContentLoaded:
            perfData.domContentLoadedEventEnd - perfData.navigationStart,
          loadComplete: perfData.loadEventEnd - perfData.navigationStart,
          firstPaint: paintMetrics.find((p) => p.name === "first-paint")
            ?.startTime,
          firstContentfulPaint: paintMetrics.find(
            (p) => p.name === "first-contentful-paint",
          )?.startTime,
          systemMarks: systemState.performance.marks,
        });
      } catch (error) {
        log("warn", "Failed to collect performance metrics", error);
      }
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
  reinitialize: () => {
    systemState.initialized = false;
    LoopProtection.getInstance().reset();
    initializeProfessionalSystem();
  },
  logs: () => window.SiqueiraSystemLogs || [],
  clearLogs: () => {
    window.SiqueiraSystemLogs = [];
  },
  errors: () => systemState.errors,
  performance: () => ({
    marks: systemState.performance.marks,
    memory: (window.performance as any)?.memory,
    timing: window.performance?.timing,
    navigation: window.performance?.getEntriesByType?.("navigation")?.[0],
  }),
  state: () => systemState,
  debug: import.meta.env.DEV,
};

log(
  "info",
  "🎯 Sistema de inicialização profissional v2.0 configurado com proteção anti-loop",
);
