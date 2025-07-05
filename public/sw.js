// Siqueira Campos Imóveis - Service Worker
// Versão limpa sem conexões externas

console.log("🔧 Service Worker Siqueira Campos iniciado");

// Install event - apenas log
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker instalado");
  self.skipWaiting();
});

// Activate event - apenas log
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker ativado");
  event.waitUntil(clients.claim());
});

// Fetch event - passa todas as requisições direto
self.addEventListener("fetch", (event) => {
  // Não fazer cache, não interceptar, apenas passar direto
  return;
});

console.log("✅ Service Worker Siqueira Campos configurado");
