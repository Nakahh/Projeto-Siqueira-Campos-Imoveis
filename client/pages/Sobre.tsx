import React from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Home,
  TrendingUp,
  Shield,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Sobre() {
  const stats = [
    { icon: Home, value: "1000+", label: "Imóveis Vendidos" },
    { icon: Users, value: "500+", label: "Famílias Satisfeitas" },
    { icon: Award, value: "10+", label: "Anos de Experiência" },
    { icon: TrendingUp, value: "98%", label: "Taxa de Satisfação" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparência",
      description:
        "Processos claros e honestos em todas as negociações, sem surpresas.",
    },
    {
      icon: Heart,
      title: "Dedicação",
      description:
        "Comprometimento total em encontrar a solução ideal para cada cliente.",
    },
    {
      icon: Star,
      title: "Excelência",
      description:
        "Atendimento de alta qualidade e resultados que superam expectativas.",
    },
    {
      icon: Users,
      title: "Relacionamento",
      description:
        "Construímos relações duradouras baseadas na confiança e respeito.",
    },
  ];

  const services = [
    {
      title: "Venda de Imóveis",
      description:
        "Assessoria completa para vender seu imóvel com agilidade e segurança.",
      features: [
        "Avaliação gratuita",
        "Marketing digital",
        "Acompanhamento jurídico",
        "Negociação especializada",
      ],
    },
    {
      title: "Compra de Imóveis",
      description:
        "Te ajudamos a encontrar o imóvel perfeito dentro do seu orçamento.",
      features: [
        "Busca personalizada",
        "Visitas agendadas",
        "Análise de documentos",
        "Suporte no financiamento",
      ],
    },
    {
      title: "Locação",
      description:
        "Serviços completos de locação para proprietários e inquilinos.",
      features: [
        "Gestão de contratos",
        "Seleção de inquilinos",
        "Administração predial",
        "Suporte jurídico",
      ],
    },
    {
      title: "Consultoria",
      description:
        "Orientação especializada para investimentos e decisões imobiliárias.",
      features: [
        "Análise de mercado",
        "Estratégias de investimento",
        "Viabilidade financeira",
        "Tendências do setor",
      ],
    },
  ];

  const teamMembers = [
    {
      name: "Juarez Siqueira",
      role: "Fundador e CEO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description:
        "Mais de 15 anos de experiência no mercado imobiliário de Goiânia.",
      specialties: ["Negociação", "Avaliação", "Investimentos"],
    },
    {
      name: "Ana Silva",
      role: "Corretora Senior",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Especialista em imóveis residenciais de alto padrão.",
      specialties: ["Residencial", "Luxo", "Atendimento VIP"],
    },
    {
      name: "Carlos Santos",
      role: "Corretor",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Focado em primeiros imóveis e financiamento habitacional.",
      specialties: ["Primeira casa", "Financiamento", "Jovens famílias"],
    },
    {
      name: "Maria Costa",
      role: "Corretora",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Especialista em imóveis comerciais e investimentos.",
      specialties: ["Comercial", "Investimentos", "Consultoria"],
    },
  ];

  const timeline = [
    {
      year: "2014",
      title: "Fundação",
      description: "Início das atividades focado no mercado residencial.",
    },
    {
      year: "2016",
      title: "Expansão",
      description: "Ampliação para imóveis comerciais e investimentos.",
    },
    {
      year: "2018",
      title: "Tecnologia",
      description: "Implementação de plataforma digital e CRM avançado.",
    },
    {
      year: "2020",
      title: "Crescimento",
      description: "Marca de 500 imóveis vendidos e equipe especializada.",
    },
    {
      year: "2022",
      title: "Reconhecimento",
      description: "Prêmio de melhor imobiliária de Goiânia.",
    },
    {
      year: "2024",
      title: "Inovação",
      description: "Lançamento da plataforma digital integrada.",
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-brand-brown-900 to-brand-brown-700 text-white rounded-lg overflow-hidden mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          <div className="relative p-8 md:p-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Sobre a Siqueira Campos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-brand-beige-200 max-w-3xl mx-auto">
              Mais de 10 anos conectando pessoas aos seus sonhos imobiliários em
              Goiânia e região metropolitana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-brand-beige-400 text-brand-brown-900 hover:bg-brand-beige-500"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar Conosco
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-beige-400 text-brand-beige-400 hover:bg-brand-beige-400 hover:text-brand-brown-900"
              >
                Ver Imóveis
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-brand-brown-700" />
                </div>
                <div className="text-3xl font-bold text-brand-brown-700 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nossa História */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossa História
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Fundada em 2014 com o objetivo de transformar sonhos em realidade,
              a Siqueira Campos Imóveis nasceu da paixão por conectar pessoas ao
              lar ideal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Escritório Siqueira Campos"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Compromisso com a Excelência
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Desde o início, nossa missão tem sido proporcionar uma
                experiência excepcional no mercado imobiliário. Acreditamos que
                comprar, vender ou alugar um imóvel é muito mais que uma
                transação comercial - é um marco na vida das pessoas.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Nossa equipe de profissionais especializados trabalha
                incansavelmente para entender as necessidades únicas de cada
                cliente, oferecendo soluções personalizadas e suporte completo
                em todas as etapas do processo.
              </p>
              <div className="space-y-3">
                {[
                  "Atendimento personalizado e humanizado",
                  "Processos transparentes e seguros",
                  "Conhecimento profundo do mercado local",
                  "Tecnologia de ponta para melhor experiência",
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nossos Valores */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Princípios que orientam nossa atuação e garantem a qualidade dos
              nossos serviços
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 h-full">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-brand-brown-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nossos Serviços */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Soluções completas para todas suas necessidades imobiliárias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nossa Equipe */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Profissionais especializados e comprometidos com seu sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-brand-brown-700 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.specialties.map((specialty, specialtyIndex) => (
                      <Badge
                        key={specialtyIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Linha do Tempo */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossa Trajetória
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Marcos importantes da nossa história
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-brand-brown-200"></div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 md:w-1/2">
                    <Card
                      className={`p-6 ${
                        index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      } ml-12 md:ml-0`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="text-2xl font-bold text-brand-brown-700 mr-4">
                          {item.year}
                        </div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </Card>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-brand-brown-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Entre em Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-semibold mb-2">Telefone/WhatsApp</h3>
                <p className="text-brand-brown-700 font-medium">
                  (62) 9 8556-3505
                </p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    window.open("https://wa.me/5562985563505", "_blank")
                  }
                >
                  Chamar no WhatsApp
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-brand-brown-700 font-medium">
                  SiqueiraCamposImoveisGoiania@gmail.com
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    (window.location.href =
                      "mailto:SiqueiraCamposImoveisGoiania@gmail.com")
                  }
                >
                  Enviar Email
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-semibold mb-2">Instagram</h3>
                <p className="text-brand-brown-700 font-medium">
                  @imoveissiqueiracampos
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    window.open(
                      "https://instagram.com/imoveissiqueiracampos",
                      "_blank",
                    )
                  }
                >
                  Seguir
                </Button>
              </div>
            </div>

            <div className="text-center mt-8 p-6 bg-brand-brown-50 dark:bg-brand-brown-900 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-brand-brown-700 mr-2" />
                <span className="font-semibold">Localização</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Atendemos toda Goiânia e região metropolitana
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
