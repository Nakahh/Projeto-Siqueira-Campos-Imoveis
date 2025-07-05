import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Home,
  Search,
  Calculator,
  MessageCircle,
  FileText,
  Users,
  Shield,
  Award,
  Heart,
  Send,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de newsletter
  };

  return (
    <footer className="bg-brand-brown-900 text-brand-beige-100">
      {/* Newsletter Section */}
      <div className="bg-brand-brown-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Receba as melhores oportunidades
            </h3>
            <p className="text-brand-beige-300 mb-6">
              Cadastre-se em nossa newsletter e seja o primeiro a saber sobre
              novos imóveis e ofertas exclusivas
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Seu melhor email"
                className="bg-white/10 border-white/20 text-white placeholder:text-brand-beige-300"
                required
              />
              <Button
                type="submit"
                className="bg-brand-beige-400 text-brand-brown-900 hover:bg-brand-beige-500"
              >
                <Send className="h-4 w-4 mr-2" />
                Cadastrar
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Home className="h-8 w-8 text-brand-beige-400" />
                <h3 className="text-xl font-bold">Siqueira Campos Imóveis</h3>
              </div>
              <p className="text-brand-beige-300 leading-relaxed">
                Há mais de 10 anos realizando sonhos e conectando pessoas aos
                seus lares ideais em Goiânia e região metropolitana.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-brand-beige-400" />
                  <span className="text-sm">(62) 9 8556-3505</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-brand-beige-400" />
                  <span className="text-sm">
                    SiqueiraCamposImoveisGoiania@gmail.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-brand-beige-400" />
                  <span className="text-sm">Goiânia - GO</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-brand-beige-400 hover:text-white hover:bg-brand-brown-700"
                  asChild
                >
                  <a
                    href="https://instagram.com/imoveissiqueiracampos"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-brand-beige-400 hover:text-white hover:bg-brand-brown-700"
                  asChild
                >
                  <a
                    href="https://wa.me/5562985563505"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-brand-beige-400 hover:text-white hover:bg-brand-brown-700"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-brand-beige-400 hover:text-white hover:bg-brand-brown-700"
                >
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-brand-beige-200">
                Navegação
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Início</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/imoveis"
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Imóveis</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/simulador-financiamento"
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors flex items-center space-x-2"
                  >
                    <Calculator className="h-4 w-4" />
                    <span>Simulador</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Blog</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sobre"
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Sobre Nós</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contato"
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contato</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-brand-beige-200">
                Serviços
              </h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-brand-beige-300 flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Venda de Imóveis</span>
                  </span>
                </li>
                <li>
                  <span className="text-brand-beige-300 flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Locação de Imóveis</span>
                  </span>
                </li>
                <li>
                  <span className="text-brand-beige-300 flex items-center space-x-2">
                    <Calculator className="h-4 w-4" />
                    <span>Financiamento Imobiliário</span>
                  </span>
                </li>
                <li>
                  <span className="text-brand-beige-300 flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Consultoria Jurídica</span>
                  </span>
                </li>
                <li>
                  <span className="text-brand-beige-300 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Avaliação de Imóveis</span>
                  </span>
                </li>
                <li>
                  <span className="text-brand-beige-300 flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Gestão Patrimonial</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-brand-beige-200">
                Confiança e Segurança
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-brand-beige-400" />
                  <div>
                    <p className="text-sm font-medium">CRECI Ativo</p>
                    <p className="text-xs text-brand-beige-400">
                      Profissionais Licenciados
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-brand-beige-400" />
                  <div>
                    <p className="text-sm font-medium">10+ Anos</p>
                    <p className="text-xs text-brand-beige-400">
                      de Experiência
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-brand-beige-400" />
                  <div>
                    <p className="text-sm font-medium">1000+ Clientes</p>
                    <p className="text-xs text-brand-beige-400">Satisfeitos</p>
                  </div>
                </div>
              </div>

              {/* Developer Credit */}
              <div className="pt-4 border-t border-brand-brown-700">
                <p className="text-xs text-brand-beige-400 mb-2">
                  Desenvolvido por:
                </p>
                <Link
                  to="/desenvolvedor"
                  className="flex items-center space-x-2 text-brand-beige-300 hover:text-brand-beige-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">K</span>
                  </div>
                  <span className="text-sm font-medium">KRYONIX</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-brand-brown-700" />

      {/* Bottom Bar */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-brand-beige-400">
                © {currentYear} Siqueira Campos Imóveis. Todos os direitos
                reservados.
              </p>
            </div>

            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link
                to="/privacidade"
                className="text-brand-beige-400 hover:text-brand-beige-200 transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                to="/termos"
                className="text-brand-beige-400 hover:text-brand-beige-200 transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                to="/cookies"
                className="text-brand-beige-400 hover:text-brand-beige-200 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
