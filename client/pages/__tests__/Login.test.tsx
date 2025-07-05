import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "../Login";

// Mock do react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const LoginWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe("Login Component", () => {
  it("deve renderizar corretamente", () => {
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>,
    );

    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("deve mostrar erro com campos vazios", async () => {
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>,
    );

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    });
  });

  it("deve validar formato de email", async () => {
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>,
    );

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: "email-invalido" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email deve ser válido")).toBeInTheDocument();
    });
  });
});
