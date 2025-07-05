import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock para autenticação
  http.post("/api/auth/login", () => {
    return HttpResponse.json({
      success: true,
      user: {
        id: 1,
        nome: "Test User",
        email: "test@test.com",
        tipo: "CORRETOR",
      },
      token: "mock-jwt-token",
    });
  }),

  // Mock para imóveis
  http.get("/api/imoveis", () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 1,
          titulo: "Casa de Teste",
          preco: 500000,
          tipo: "CASA",
          endereco: "Rua Teste, 123",
          quartos: 3,
          banheiros: 2,
          vagas: 2,
          area: 120,
          fotos: [],
        },
      ],
    });
  }),

  // Mock para usuário atual
  http.get("/api/auth/me", () => {
    return HttpResponse.json({
      success: true,
      user: {
        id: 1,
        nome: "Test User",
        email: "test@test.com",
        tipo: "CORRETOR",
      },
    });
  }),
];
