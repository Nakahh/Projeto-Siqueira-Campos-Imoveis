import React from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Github,
  ExternalLink,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Star,
  Users,
  Calendar,
  MapPin,
  Award,
  Coffee,
  Zap,
  Shield,
  Database,
  Smartphone,
  Monitor,
  Palette,
} from "lucide-react";

export default function Desenvolvedor() {
  const skills = [
    { name: "React.js", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Language" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "PostgreSQL", level: 80, category: "Database" },
    { name: "Python", level: 75, category: "Language" },
    { name: "Docker", level: 70, category: "DevOps" },
    { name: "AWS", level: 65, category: "Cloud" },
    { name: "Next.js", level: 85, category: "Framework" },
  ];

  const projects = [
    {
      name: "Sistema Imobiliário Completo",
      description:
        "Plataforma completa de gestão imobiliária com IA, automação WhatsApp e dashboards multi-role",
      tech: ["React", "Node.js", "PostgreSQL", "OpenAI", "N8N"],
      status: "Concluído",
      link: "#",
    },
    {
      name: "E-commerce B2B",
      description:
        "Plataforma de vendas B2B com sistema de pedidos, estoque e relatórios avançados",
      tech: ["Next.js", "Prisma", "Stripe", "Redis"],
      status: "Em Desenvolvimento",
      link: "#",
    },
    {
      name: "Dashboard Analytics",
      description:
        "Sistema de analytics em tempo real com visualizações interativas",
      tech: ["React", "D3.js", "WebSocket", "MongoDB"],
      status: "Planejado",
      link: "#",
    },
  ];

  const services = [
    {
      icon: Monitor,
      title: "Desenvolvimento Web",
      description:
        "Criação de aplicações web modernas e responsivas usando as mais recentes tecnologias.",
    },
    {
      icon: Smartphone,
      title: "Desenvolvimento Mobile",
      description: "Aplicativos móveis nativos e híbridos para iOS e Android.",
    },
    {
      icon: Database,
      title: "Backend & APIs",
      description:
        "Desenvolvimento de APIs robustas e sistemas backend escaláveis.",
    },
    {
      icon: Zap,
      title: "Automação",
      description:
        "Criação de fluxos automatizados e integração entre sistemas.",
    },
    {
      icon: Shield,
      title: "Segurança",
      description:
        "Implementação de práticas de segurança e proteção de dados.",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Design de interfaces intuitivas e experiências de usuário otimizadas.",
    },
  ];

  const testimonials = [
    {
      name: "Juarez Siqueira",
      role: "CEO - Siqueira Campos Imóveis",
      content:
        "Trabalho excepcional! O sistema desenvolvido transformou completamente nossa operação. A automação com WhatsApp e IA aumentou nossa produtividade em 300%.",
      rating: 5,
    },
    {
      name: "Maria Silva",
      role: "Diretora Comercial - TechCorp",
      content:
        "Profissional altamente qualificado. Entregou o projeto no prazo e com qualidade superior ao esperado. Recomendo sem hesitação.",
      rating: 5,
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "50+ Projetos Concluídos",
      description: "Projetos entregues com sucesso",
    },
    {
      icon: Users,
      title: "30+ Clientes Satisfeitos",
      description: "Empresas que confiaram no nosso trabalho",
    },
    {
      icon: Coffee,
      title: "3+ Anos de Experiência",
      description: "Desenvolvendo soluções inovadoras",
    },
    {
      icon: Star,
      title: "4.9/5 Avaliação",
      description: "Nota média dos clientes",
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-brand-brown-900 to-brand-brown-700 text-white rounded-lg overflow-hidden mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          <div className="relative p-8 md:p-16">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Desenvolvimento
                <span className="block text-brand-beige-400">
                  Personalizado
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-brand-beige-200">
                Criamos soluções tecnológicas sob medida para impulsionar seu
                negócio. Especialista em React, Node.js e automação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-brand-beige-400 text-brand-brown-900 hover:bg-brand-beige-500"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Iniciar Projeto
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-beige-400 text-brand-beige-400 hover:bg-brand-beige-400 hover:text-brand-brown-900"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Ver Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Serviços Oferecidos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Soluções completas de desenvolvimento, desde o conceito até a
              implementa��ão final
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-brand-brown-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tecnologias & Habilidades
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Domínio das principais tecnologias modernas de desenvolvimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {skill.level}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-brand-brown-700 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Projetos Recentes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Alguns dos projetos mais recentes desenvolvidos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      variant={
                        project.status === "Concluído"
                          ? "default"
                          : project.status === "Em Desenvolvimento"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Depoimentos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              O que os clientes falam sobre nosso trabalho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Vamos Conversar Sobre Seu Projeto?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Estou sempre aberto a novos desafios e projetos interessantes.
                Entre em contato para discutirmos como posso ajudar a
                transformar sua ideia em realidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-brand-brown-700 font-medium">
                  dev@kryonix.com.br
                </p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    (window.location.href = "mailto:dev@kryonix.com.br")
                  }
                >
                  Enviar Email
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-brand-brown-700 font-medium">
                  (62) 9 9999-9999
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    window.open("https://wa.me/5562999999999", "_blank")
                  }
                >
                  Chamar no WhatsApp
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-brown-100 dark:bg-brand-brown-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Linkedin className="h-8 w-8 text-brand-brown-700" />
                </div>
                <h3 className="font-semibold mb-2">LinkedIn</h3>
                <p className="text-brand-brown-700 font-medium">
                  /in/dev-kryonix
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    window.open("https://linkedin.com/in/dev-kryonix", "_blank")
                  }
                >
                  Conectar
                </Button>
              </div>
            </div>

            <div className="text-center mt-8 p-6 bg-brand-brown-50 dark:bg-brand-brown-900 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-brand-brown-700 mr-2" />
                <span className="font-semibold">Disponibilidade</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Aceito novos projetos | Resposta em até 24h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
