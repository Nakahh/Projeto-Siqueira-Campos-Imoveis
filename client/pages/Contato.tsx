import React, { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ContactForm {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  tipoContato: string;
}

export default function Contato() {
  const [formData, setFormData] = useState<ContactForm>({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
    tipoContato: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        });
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          assunto: "",
          mensagem: "",
          tipoContato: "",
        });
      } else {
        throw new Error("Erro ao enviar mensagem");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Telefone/WhatsApp",
      value: "(62) 9 8556-3505",
      description: "Segunda a Sexta, 8h às 18h",
      action: () => window.open("https://wa.me/5562985563505", "_blank"),
      actionLabel: "Chamar no WhatsApp",
    },
    {
      icon: Mail,
      title: "Email",
      value: "SiqueiraCamposImoveisGoiania@gmail.com",
      description: "Respondemos em até 24h",
      action: () =>
        (window.location.href =
          "mailto:SiqueiraCamposImoveisGoiania@gmail.com"),
      actionLabel: "Enviar Email",
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@imoveissiqueiracampos",
      description: "Acompanhe nossas novidades",
      action: () =>
        window.open("https://instagram.com/imoveissiqueiracampos", "_blank"),
      actionLabel: "Seguir no Instagram",
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "Goiânia - GO",
      description: "Atendemos toda a região metropolitana",
      action: () => {},
      actionLabel: "Ver no Mapa",
    },
  ];

  const faq = [
    {
      question: "Como posso agendar uma visita?",
      answer:
        "Você pode agendar uma visita através do nosso site, clicando no botão 'Agendar Visita' na página do imóvel, ou entrando em contato conosco pelo WhatsApp.",
    },
    {
      question: "Vocês trabalham com financiamento imobiliário?",
      answer:
        "Sim! Temos parcerias com os principais bancos e instituições financeiras. Nossos corretores podem te ajudar a simular e encontrar as melhores condições de financiamento.",
    },
    {
      question: "Qual a comissão para vender meu imóvel?",
      answer:
        "Nossa comissão varia de acordo com o tipo e valor do imóvel. Entre em contato conosco para uma avaliação gratuita e personalizada.",
    },
    {
      question: "Vocês fazem avaliação gratuita?",
      answer:
        "Sim! Oferecemos avaliação gratuita do seu imóvel. Um de nossos corretores especializados fará uma análise detalhada para determinar o valor justo de mercado.",
    },
    {
      question: "Como funciona o aluguel de imóveis?",
      answer:
        "Fazemos toda a gestão do aluguel, desde a busca por inquilinos qualificados até a administração do contrato. Entre em contato para saber mais sobre nossos serviços.",
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Estamos aqui para ajudá-lo a encontrar o imóvel perfeito ou vender o
            seu. Nossa equipe especializada está pronta para atendê-lo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                {message && (
                  <Alert
                    className={`mb-6 ${
                      message.type === "success"
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        required
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                      <Input
                        id="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) =>
                          handleChange("telefone", e.target.value)
                        }
                        required
                        placeholder="(62) 9 9999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipoContato">Tipo de Contato</Label>
                      <Select
                        value={formData.tipoContato}
                        onValueChange={(value) =>
                          handleChange("tipoContato", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comprar">
                            Quero Comprar Imóvel
                          </SelectItem>
                          <SelectItem value="alugar">
                            Quero Alugar Imóvel
                          </SelectItem>
                          <SelectItem value="vender">
                            Quero Vender Meu Imóvel
                          </SelectItem>
                          <SelectItem value="avaliar">
                            Avaliação Gratuita
                          </SelectItem>
                          <SelectItem value="financiamento">
                            Financiamento Imobiliário
                          </SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assunto">Assunto</Label>
                    <Input
                      id="assunto"
                      type="text"
                      value={formData.assunto}
                      onChange={(e) => handleChange("assunto", e.target.value)}
                      placeholder="Resumo do seu interesse"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      value={formData.mensagem}
                      onChange={(e) => handleChange("mensagem", e.target.value)}
                      required
                      placeholder="Descreva seus interesses, tipo de imóvel desejado, localização preferida, orçamento, etc."
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-brown-700 hover:bg-brand-brown-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-lg flex items-center justify-center">
                        <method.icon className="h-5 w-5 text-brand-brown-700" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {method.title}
                      </h3>
                      <p className="text-brand-brown-700 font-medium">
                        {method.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.description}
                      </p>
                      {method.action && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={method.action}
                          className="mt-2"
                        >
                          {method.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta:</span>
                    <span className="font-medium">8h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span className="font-medium">8h às 12h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span className="font-medium">Fechado</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-brand-beige-50 dark:bg-brand-brown-900 rounded-lg">
                  <p className="text-sm text-brand-brown-700 dark:text-brand-beige-300">
                    <strong>WhatsApp 24h:</strong> Para emergências e dúvidas
                    rápidas, nosso WhatsApp funciona 24 horas por dia!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faq.map((item, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </p>
                  {index < faq.length - 1 && (
                    <hr className="mt-6 border-gray-200 dark:border-gray-700" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-brand-brown-700 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Encontrar seu Imóvel dos Sonhos?
          </h2>
          <p className="text-xl mb-6 text-brand-beige-200">
            Nossa equipe especializada está pronta para ajudá-lo em cada passo
            do processo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-brand-beige-400 text-brand-brown-900 hover:bg-brand-beige-500"
              onClick={() =>
                window.open("https://wa.me/5562985563505", "_blank")
              }
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-brand-beige-400 text-brand-beige-400 hover:bg-brand-beige-400 hover:text-brand-brown-900"
              onClick={() => (window.location.href = "/imoveis")}
            >
              Ver Imóveis Disponíveis
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
