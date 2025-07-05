import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";

function MinimalApp() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-green-600">
        ✅ React Funcionando!
      </h1>
      <p className="mt-4 text-xl">
        Sistema Siqueira Campos Imóveis carregando...
      </p>
    </div>
  );
}

console.log("🚀 Iniciando React...");

try {
  const root = document.getElementById("root");
  if (root) {
    console.log("✅ Root element encontrado");
    ReactDOM.createRoot(root).render(<MinimalApp />);
    console.log("✅ React renderizado com sucesso");
  } else {
    console.error("❌ Root element não encontrado");
  }
} catch (error) {
  console.error("❌ Erro ao iniciar React:", error);
}
