import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  User,
  Eye,
  ArrowRight,
  TrendingUp,
  Home,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";

interface BlogPost {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  autor: string;
  categoria: string;
  tags: string[];
  imagem: string;
  dataPublicacao: string;
  visualizacoes: number;
  tempoLeitura: number;
  destaque: boolean;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    // Simular carregamento de posts do blog
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  };

  const mockPosts: BlogPost[] = [
    {
      id: 1,
      titulo: "Como escolher o bairro ideal para morar em Goiânia",
      resumo:
        "Descubra os fatores essenciais para escolher o bairro perfeito para sua família, considerando segurança, infraestrutura e qualidade de vida.",
      conteudo: "",
      autor: "Equipe Siqueira Campos",
      categoria: "Dicas",
      tags: ["goiania", "bairros", "moradia", "familia"],
      imagem:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dataPublicacao: "2024-01-15",
      visualizacoes: 1245,
      tempoLeitura: 5,
      destaque: true,
    },
    {
      id: 2,
      titulo: "Financiamento imobiliário: SAC ou Tabela Price?",
      resumo:
        "Entenda as diferenças entre os sistemas de amortização e qual é o melhor para seu perfil financeiro.",
      conteudo: "",
      autor: "Carlos Silva",
      categoria: "Financiamento",
      tags: ["financiamento", "sac", "price", "juros"],
      imagem:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dataPublicacao: "2024-01-12",
      visualizacoes: 987,
      tempoLeitura: 7,
      destaque: false,
    },
    {
      id: 3,
      titulo: "Valorização imobiliária: tendências para 2024",
      resumo:
        "Análise do mercado imobiliário e perspectivas de valorização para diferentes regiões de Goiânia.",
      conteudo: "",
      autor: "Ana Martins",
      categoria: "Mercado",
      tags: ["valorizacao", "mercado", "investimento", "2024"],
      imagem:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dataPublicacao: "2024-01-10",
      visualizacoes: 2156,
      tempoLeitura: 8,
      destaque: true,
    },
    {
      id: 4,
      titulo: "Documentação necessária para comprar um imóvel",
      resumo:
        "Lista completa dos documentos essenciais para uma compra segura e sem surpresas.",
      conteudo: "",
      autor: "João Santos",
      categoria: "Legal",
      tags: ["documentacao", "compra", "legal", "papelada"],
      imagem:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dataPublicacao: "2024-01-08",
      visualizacoes: 756,
      tempoLeitura: 6,
      destaque: false,
    },
    {
      id: 5,
      titulo: "FGTS no financiamento: como usar corretamente",
      resumo:
        "Aprenda todas as formas de utilizar seu FGTS para facilitar a compra do seu imóvel.",
      conteudo: "",
      autor: "Maria Costa",
      categoria: "Financiamento",
      tags: ["fgts", "financiamento", "casa propria", "governo"],
      imagem:
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dataPublicacao: "2024-01-05",
      visualizacoes: 1432,
      tempoLeitura: 5,
      destaque: false,
    },
    {
      id: 6,
      titulo: "Investir em imóveis: aluguel ou venda?",
      resumo:
        "Análise comparativa entre estratégias de investimento imobiliário para maximizar seu retorno.",
      conteudo: "",
      autor: "Roberto Lima",
      categoria: "Investimento",
      tags: ["investimento", "aluguel", "venda", "roi"],
      imagem:
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      dataPublicacao: "2024-01-03",
      visualizacoes: 1678,
      tempoLeitura: 9,
      destaque: true,
    },
  ];

  const categories = [
    { value: "todos", label: "Todos", count: mockPosts.length },
    {
      value: "Dicas",
      label: "Dicas",
      count: mockPosts.filter((p) => p.categoria === "Dicas").length,
    },
    {
      value: "Financiamento",
      label: "Financiamento",
      count: mockPosts.filter((p) => p.categoria === "Financiamento").length,
    },
    {
      value: "Mercado",
      label: "Mercado",
      count: mockPosts.filter((p) => p.categoria === "Mercado").length,
    },
    {
      value: "Legal",
      label: "Legal",
      count: mockPosts.filter((p) => p.categoria === "Legal").length,
    },
    {
      value: "Investimento",
      label: "Investimento",
      count: mockPosts.filter((p) => p.categoria === "Investimento").length,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || post.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter((post) => post.destaque).slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Imobiliário
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Fique por dentro das novidades do mercado imobiliário, dicas de
            compra e venda, e tendências do setor
          </p>
        </div>

        {/* Posts em Destaque */}
        {!searchTerm && selectedCategory === "todos" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Posts em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={post.imagem}
                      alt={post.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-brand-brown-700">
                      Destaque
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 bg-white/90"
                    >
                      {post.categoria}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-brand-brown-700 transition-colors">
                      {post.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                      {post.resumo}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.autor}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.tempoLeitura} min
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.visualizacoes}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Busca e Filtros */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={
                  selectedCategory === category.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={
                  selectedCategory === category.value
                    ? "bg-brand-brown-700 hover:bg-brand-brown-800"
                    : ""
                }
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Posts */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-16 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("todos");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={post.imagem}
                    alt={post.titulo}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 bg-white/90"
                  >
                    {post.categoria}
                  </Badge>
                  {post.destaque && (
                    <Badge className="absolute top-3 left-3 bg-brand-brown-700">
                      Destaque
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-brand-brown-700 transition-colors">
                    {post.titulo}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.resumo}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.autor}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.dataPublicacao)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.tempoLeitura} min
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.visualizacoes}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-brand-brown-50 group-hover:text-brand-brown-700"
                  >
                    Ler mais
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-brand-brown-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Receba Nossas Novidades</h2>
          <p className="text-xl mb-6 text-brand-beige-200">
            Assine nossa newsletter e fique por dentro das últimas tendências do
            mercado imobiliário
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Seu melhor email"
              className="bg-white text-gray-900"
            />
            <Button className="bg-brand-beige-400 text-brand-brown-900 hover:bg-brand-beige-500">
              Assinar
            </Button>
          </div>
          <p className="text-sm text-brand-beige-300 mt-4">
            Prometemos não enviar spam. Você pode cancelar a qualquer momento.
          </p>
        </div>

        {/* Tópicos Populares */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tópicos Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Home, label: "Primeira Casa", count: 12 },
              { icon: DollarSign, label: "Financiamento", count: 8 },
              { icon: TrendingUp, label: "Investimentos", count: 15 },
              { icon: FileText, label: "Documentação", count: 6 },
            ].map((topic, index) => (
              <Card
                key={index}
                className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <topic.icon className="h-8 w-8 mx-auto mb-2 text-brand-brown-700" />
                <h3 className="font-semibold">{topic.label}</h3>
                <p className="text-sm text-gray-600">{topic.count} artigos</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
