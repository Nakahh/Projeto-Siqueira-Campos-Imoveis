import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth API", () => {
  describe("POST /api/auth/login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@siqueicamposimoveis.com.br",
        senha: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it("deve rejeitar credenciais inválidas", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalido@test.com",
        senha: "senha-errada",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
