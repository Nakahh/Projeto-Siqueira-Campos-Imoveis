import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  MessageCircle,
  Home,
  Search,
  Calculator,
  BookOpen,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Início", href: "/" },
    { label: "Imóveis", href: "/imoveis" },
    { label: "Simulador", href: "/simulador-financiamento" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "/contato" },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "(62) 9 8556-3505",
      href: "https://wa.me/5562985563505",
      action: "WhatsApp",
    },
    {
      icon: Instagram,
      label: "@imoveissiqueiracampos",
      href: "https://instagram.com/imoveissiqueiracampos",
      action: "Instagram",
    },
    {
      icon: Mail,
      label: "SiqueiraCamposImoveisGoiania@gmail.com",
      href: "mailto:SiqueiraCamposImoveisGoiania@gmail.com",
      action: "Email",
    },
    {
      icon: MapPin,
      label: "Goiânia - GO",
      href: "#",
      action: "Localização",
    },
  ];

  return (
    <footer className="bg-brand-brown-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/assets/175866fa236440d4a5b360ca5b1302b3/siqueira-campos-para-fundo-escuro-2b3ef2?format=webp&width=800"
                alt="Siqueira Campos Imóveis"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-brand-beige-200 mb-6 max-w-md">
              Sua imobiliária de confiança em Goiânia. Encontre o imóvel dos
              seus sonhos com a melhor equipe de corretores especializados.
            </p>
            <div className="flex flex-wrap gap-2">
              {contactInfo.map((contact) => (
                <Button
                  key={contact.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-brand-beige-400 text-brand-beige-400 hover:bg-brand-beige-400 hover:text-brand-brown-900"
                >
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <contact.icon className="mr-2 h-4 w-4" />
                    {contact.action}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-brand-beige-100 mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-brand-beige-300 hover:text-brand-beige-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-semibold text-brand-beige-100 mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((contact) => (
                <li key={contact.label}>
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-brand-beige-300 hover:text-brand-beige-100 transition-colors"
                  >
                    <contact.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{contact.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-brand-brown-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-brand-beige-400 text-sm mb-4 md:mb-0">
              © {currentYear} Siqueira Campos Imóveis. Todos os direitos
              reservados.
            </div>

            {/* Link do desenvolvedor */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-brand-beige-400">Desenvolvido por</span>
              <Link
                to="/desenvolvedor"
                className="flex items-center space-x-1 text-brand-beige-200 hover:text-brand-beige-100 transition-colors"
              >
                <img
                  src="https://cdn.builder.io/api/v1/assets/175866fa236440d4a5b360ca5b1302b3/logo-kryonix-3f1062?format=webp&width=800"
                  alt="KRYONIX"
                  className="h-5 w-auto"
                />
                <span className="font-medium">KRYONIX</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
