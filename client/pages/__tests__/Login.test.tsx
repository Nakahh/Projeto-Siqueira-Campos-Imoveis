import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "../Login";

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
  });

  it("deve mostrar campos de email e senha", () => {
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>,
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });
});
