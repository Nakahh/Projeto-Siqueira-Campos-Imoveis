import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

console.log("🏠 Siqueira Campos Imóveis - KRYONIX Technology");

// Simple initialization without complex protection systems
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Hide loading state
  const loadingState = document.getElementById("loading-state");
  if (loadingState) {
    loadingState.style.display = "none";
  }

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

// Simple DOM ready check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
