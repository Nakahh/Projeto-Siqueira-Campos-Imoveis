import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Depoimento {
  id: number;
  nome: string;
  conteudo: string;
  nota: number;
  foto?: string;
  cidade?: string;
  cliente?: {
    nome: string;
    avatar?: string;
  };
  imovel?: {
    titulo: string;
    endereco: string;
    bairro: string;
  };
}

export default function DepoimentosSection() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadDepoimentos();
  }, []);

  const loadDepoimentos = async () => {
    try {
      const response = await fetch("/api/depoimentos?destaque=true&limit=6");
      const data = await response.json();

      if (data.success) {
        setDepoimentos(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (nota: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= depoimentos.length - 3 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? Math.max(0, depoimentos.length - 3) : prev - 1,
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-brown-800 dark:text-brand-beige-200 mb-4">
              O que nossos clientes dizem
            </h2>
            <div className="h-6 bg-gray-200 rounded animate-pulse max-w-md mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (depoimentos.length === 0) {
    return null; // Não mostrar a seção se não houver depoimentos
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-brand-brown-600 hover:bg-brand-brown-700">
            Depoimentos
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-brown-800 dark:text-brand-beige-200 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-brand-brown-600 dark:text-brand-beige-300 max-w-2xl mx-auto">
            Confira os depoimentos de quem já encontrou o imóvel dos sonhos
            conosco
          </p>
        </div>

        {/* Depoimentos Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {depoimentos.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Depoimentos Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
              }}
            >
              {depoimentos.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="w-full md:w-1/3 flex-shrink-0 px-3"
                >
                  <Card className="h-full bg-white/70 backdrop-blur-sm border-brand-brown-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      {/* Quote Icon */}
                      <Quote className="h-8 w-8 text-brand-brown-400 mb-4" />

                      {/* Rating */}
                      <div className="mb-4">{renderStars(depoimento.nota)}</div>

                      {/* Content */}
                      <p className="text-brand-brown-700 dark:text-brand-brown-200 mb-6 leading-relaxed">
                        "{depoimento.conteudo}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center space-x-3">
                        {(depoimento.foto || depoimento.cliente?.avatar) && (
                          <img
                            src={depoimento.foto || depoimento.cliente?.avatar}
                            alt={depoimento.nome || depoimento.cliente?.nome}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-brand-brown-800 dark:text-brand-beige-200">
                            {depoimento.nome || depoimento.cliente?.nome}
                          </h4>
                          {depoimento.cidade && (
                            <p className="text-sm text-brand-brown-600 dark:text-brand-brown-300">
                              {depoimento.cidade}
                            </p>
                          )}
                          {depoimento.imovel && (
                            <p className="text-xs text-brand-brown-500 dark:text-brand-brown-400 mt-1">
                              {depoimento.imovel.titulo} -{" "}
                              {depoimento.imovel.bairro}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {depoimentos.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({
                length: Math.max(0, depoimentos.length - 2),
              }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-brand-brown-600"
                      : "bg-brand-brown-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-brand-brown-600 dark:text-brand-brown-300 mb-4">
            Você também pode compartilhar sua experiência
          </p>
          <Button
            size="lg"
            className="bg-brand-brown-600 hover:bg-brand-brown-700 text-white"
          >
            Deixar Depoimento
          </Button>
        </div>
      </div>
    </section>
  );
}
