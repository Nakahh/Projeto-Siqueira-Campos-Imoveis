import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Shield,
  Award,
  Clock,
  Home,
  Calculator,
  MapPin,
  Phone,
  Star,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ElementType;
  popular?: boolean;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Compra Premium",
    question: "Como funciona o processo de compra de imóveis premium?",
    answer:
      "Nosso processo premium inclui consultoria personalizada, análise de mercado exclusiva, visitas acompanhadas por especialistas, negociação estratégica e assessoria jurídica completa. Cuidamos de cada detalhe para que sua experiência seja excepcional.",
    icon: Crown,
    popular: true,
  },
  {
    id: "2",
    category: "Financiamento",
    question: "Quais são as opções de financiamento disponíveis?",
    answer:
      "Oferecemos as melhores condições do mercado através de parcerias com os principais bancos. Incluindo financiamento habitacional, crédito imobiliário, consórcio e financiamento direto com construtoras. Nossa equipe negocia as melhores taxas para você.",
    icon: Calculator,
    popular: true,
  },
  {
    id: "3",
    category: "Documentação",
    question: "Que documentos preciso para comprar um imóvel?",
    answer:
      "Para pessoas físicas: CPF, RG, comprovante de renda, extrato bancário e comprovante de residência. Para pessoas jurídicas: CNPJ, contrato social, certidões negativas e demonstrações financeiras. Nossa equipe orienta todo o processo.",
    icon: Shield,
    popular: false,
  },
  {
    id: "4",
    category: "Avaliação",
    question: "Como é feita a avaliação dos imóveis?",
    answer:
      "Utilizamos metodologia premium com análise comparativa de mercado, avaliação por engenheiros credenciados, histórico de vendas da região e tendências de valorização. Garantimos preços justos e competitivos.",
    icon: Award,
    popular: true,
  },
  {
    id: "5",
    category: "Tempo",
    question: "Quanto tempo leva todo o processo?",
    answer:
      "Em média, o processo completo leva de 30 a 60 dias, dependendo do tipo de financiamento. Com nosso atendimento premium, acompanhamos cada etapa e aceleramos os processos burocráticos sempre que possível.",
    icon: Clock,
    popular: false,
  },
  {
    id: "6",
    category: "Visitas",
    question: "Como agendar visitas aos imóveis?",
    answer:
      "Oferecemos visitas personalizadas com agendamento flexível, incluindo finais de semana. Nossas visitas premium incluem relatório detalhado do imóvel, análise de potencial de valorização e consultoria especializada.",
    icon: MapPin,
    popular: false,
  },
  {
    id: "7",
    category: "Garantias",
    question: "Quais garantias a Siqueira Campos oferece?",
    answer:
      "Oferecemos garantia total na documentação, seguro contra vícios ocultos, suporte jurídico pós-venda e acompanhamento durante todo o período de garantia. Sua segurança é nossa prioridade.",
    icon: Shield,
    popular: true,
  },
  {
    id: "8",
    category: "Atendimento",
    question: "Como funciona o atendimento premium?",
    answer:
      "Nosso atendimento premium inclui consultor dedicado, disponibilidade 24/7, relatórios personalizados, acesso prioritário a lançamentos e eventos exclusivos para clientes VIP.",
    icon: Star,
    popular: true,
  },
];

const categories = [
  "Todos",
  "Compra Premium",
  "Financiamento",
  "Documentação",
  "Garantias",
];

export function PremiumFAQ() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [openItems, setOpenItems] = useState<string[]>(["1", "2"]); // Popular items open by default

  const filteredFAQs = faqData.filter(
    (item) =>
      selectedCategory === "Todos" || item.category === selectedCategory,
  );

  const popularFAQs = faqData.filter((item) => item.popular);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-brand-brown-50 via-white to-brand-beige-50 dark:from-brand-brown-900 dark:via-brand-brown-800 dark:to-brand-brown-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-brand-brown-900" />
              </div>
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-brown-800 to-brand-brown-600 bg-clip-text text-transparent mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-brand-brown-600 dark:text-brand-beige-300 max-w-3xl mx-auto leading-relaxed">
            Esclarecemos todas suas dúvidas sobre nossos serviços premium de
            consultoria imobiliária
          </p>
        </div>

        {/* Popular FAQs */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Star className="h-6 w-6 text-yellow-500" />
            <h3 className="text-2xl font-bold text-brand-brown-800 dark:text-brand-beige-200">
              Perguntas Mais Populares
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {popularFAQs.slice(0, 4).map((faq) => (
              <Card
                key={faq.id}
                className="bg-white/80 dark:bg-brand-brown-800/80 backdrop-blur-sm border border-brand-brown-200/50 dark:border-brand-brown-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Collapsible
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full p-6 h-auto text-left hover:bg-brand-brown-50 dark:hover:bg-brand-brown-700"
                    >
                      <div className="flex items-start space-x-4 w-full">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <faq.icon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-brand-brown-800 dark:text-brand-beige-200 text-left">
                              {faq.question}
                            </h4>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-brand-brown-600 dark:text-brand-beige-400 flex-shrink-0 ml-2" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-brand-brown-600 dark:text-brand-beige-400 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="ml-14">
                        <p className="text-brand-brown-600 dark:text-brand-beige-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 text-white shadow-lg"
                  : "border-brand-brown-300 text-brand-brown-700 hover:bg-brand-brown-50 dark:border-brand-brown-600 dark:text-brand-beige-200 dark:hover:bg-brand-brown-800"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* All FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card
                key={faq.id}
                className="bg-white/90 dark:bg-brand-brown-800/90 backdrop-blur-sm border border-brand-brown-200/50 dark:border-brand-brown-700/50 hover:shadow-lg transition-all duration-300"
              >
                <Collapsible
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full p-6 h-auto text-left hover:bg-brand-brown-50/50 dark:hover:bg-brand-brown-700/50"
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-brown-100 to-brand-beige-100 dark:from-brand-brown-700 dark:to-brand-brown-600 rounded-xl flex items-center justify-center">
                          <faq.icon className="h-6 w-6 text-brand-brown-700 dark:text-brand-beige-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-medium text-brand-brown-500 dark:text-brand-beige-400 uppercase tracking-wide">
                                  {faq.category}
                                </span>
                                {faq.popular && (
                                  <Star className="h-3 w-3 text-yellow-500" />
                                )}
                              </div>
                              <h4 className="font-semibold text-brand-brown-800 dark:text-brand-beige-200 text-left">
                                {faq.question}
                              </h4>
                            </div>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-brand-brown-600 dark:text-brand-beige-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-brand-brown-600 dark:text-brand-beige-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="ml-16">
                        <p className="text-brand-brown-600 dark:text-brand-beige-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-brand-brown-800 to-brand-brown-900 border-none shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Phone className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-brand-beige-200 mb-6">
                Nossa equipe premium está pronta para esclarecer todas suas
                questões
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brand-brown-900 font-semibold px-8">
                  <Phone className="h-4 w-4 mr-2" />
                  Falar com Especialista
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Chat com Clara AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
