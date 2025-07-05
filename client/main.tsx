import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import "./styles/prebuild.css";
import { performanceMonitor } from "./utils/performance";

console.log("🏠 Siqueira Campos Imóveis - KRYONIX Technology v2.0");

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
    loadingState.style.transition = "opacity 0.3s ease-out";
    loadingState.style.opacity = "0";
    setTimeout(() => {
      loadingState.style.display = "none";
      performanceMonitor.markLoadComplete();
    }, 300);
  }

  const root = ReactDOM.createRoot(rootElement);

  root.render(<App />);

  // Mark render complete - only once
  let renderMarked = false;
  setTimeout(() => {
    if (!renderMarked) {
      performanceMonitor.markRenderComplete();
      performanceMonitor.markInteractive();
      renderMarked = true;
    }
  }, 100);
};

// Ensure single initialization
let appInitialized = false;

const safeInitializeApp = () => {
  if (appInitialized) return;
  appInitialized = true;
  initializeApp();
};

// Simple DOM ready check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInitializeApp);
} else {
  safeInitializeApp();
}
