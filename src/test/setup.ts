import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./mocks/server";

// Estabelecer mock requests para todos os testes
beforeAll(() => server.listen());

// Reset handlers depois de cada teste
afterEach(() => server.resetHandlers());

// Limpar depois dos testes
afterAll(() => server.close());

// Mock para window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
