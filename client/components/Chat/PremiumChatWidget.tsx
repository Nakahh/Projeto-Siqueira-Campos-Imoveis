import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Minimize2,
  Maximize2,
  Sparkles,
  Crown,
  Star,
  MapPin,
  Home,
  Calculator,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "quick-action" | "property-suggestion";
  data?: any;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  action: string;
}

export function PremiumChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const quickActions: QuickAction[] = [
    { id: "search", label: "Buscar Imóveis", icon: Home, action: "search" },
    {
      id: "calc",
      label: "Simular Financiamento",
      icon: Calculator,
      action: "calculator",
    },
    {
      id: "contact",
      label: "Falar com Corretor",
      icon: Phone,
      action: "contact",
    },
    { id: "visit", label: "Agendar Visita", icon: MapPin, action: "visit" },
  ];

  const initialMessages: Message[] = [
    {
      id: "1",
      content: user
        ? `Olá ${user.nome}! 👋 Sou a Clara, sua assistente virtual premium da Siqueira Campos. Como posso ajudá-lo hoje?`
        : "Olá! 👋 Sou a Clara, sua assistente virtual premium da Siqueira Campos. Como posso ajudá-lo a encontrar o imóvel dos seus sonhos?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
    {
      id: "2",
      content: "Aqui estão algumas coisas que posso fazer por você:",
      sender: "bot",
      timestamp: new Date(),
      type: "quick-action",
    },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(initialMessages);
      setUnreadCount(0);
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("casa") || lowerInput.includes("apartamento")) {
      return "Perfeito! Temos várias opções de casas e apartamentos premium. Que tipo de imóvel você procura? Quantos quartos? Em qual região de Goiânia?";
    } else if (lowerInput.includes("preço") || lowerInput.includes("valor")) {
      return "Nossos imóveis premium variam de R$ 300.000 a R$ 2.500.000. Qual sua faixa de investimento preferida? Posso mostrar opções personalizadas para você!";
    } else if (lowerInput.includes("financiamento")) {
      return "Oferecemos as melhores condições de financiamento! Trabalho com todos os bancos e posso simular as parcelas para você. Qual o valor do imóvel que te interessa?";
    } else if (
      lowerInput.includes("visita") ||
      lowerInput.includes("agendar")
    ) {
      return "Claro! Posso agendar uma visita personalizada para você. Prefere manhã ou tarde? Qual região te interessa mais?";
    } else {
      return "Entendi! Deixe-me conectar você com um de nossos especialistas premium. Eles terão o maior prazer em ajudá-lo de forma personalizada. ���";
    }
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "search":
        message = "Quero buscar imóveis";
        break;
      case "calculator":
        message = "Gostaria de simular um financiamento";
        break;
      case "contact":
        message = "Quero falar com um corretor";
        break;
      case "visit":
        message = "Gostaria de agendar uma visita";
        break;
      default:
        return;
    }
    setInputValue(message);
    handleSendMessage();
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <Card className="w-96 h-[600px] bg-white/95 dark:bg-brand-brown-900/95 backdrop-blur-lg border border-brand-brown-200/50 dark:border-brand-brown-700/50 shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-brand-brown-800 to-brand-brown-900 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-yellow-400">
                      <AvatarImage src="/clara-ai.png" alt="Clara AI" />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-brand-brown-900 font-bold">
                        C
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <span>Clara AI</span>
                      <Crown className="h-4 w-4 text-yellow-400" />
                    </CardTitle>
                    <p className="text-brand-beige-200 text-sm">
                      Assistente Premium • Online
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Messages */}
                <CardContent className="p-0 flex-1">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id}>
                          {message.sender === "bot" ? (
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-brand-brown-900 text-sm font-bold">
                                  C
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gradient-to-br from-brand-brown-50 to-brand-beige-50 dark:from-brand-brown-800 dark:to-brand-brown-700 p-3 rounded-2xl rounded-tl-sm max-w-xs">
                                  <p className="text-sm text-brand-brown-800 dark:text-brand-beige-100">
                                    {message.content}
                                  </p>
                                </div>
                                {message.type === "quick-action" && (
                                  <div className="grid grid-cols-2 gap-2 mt-3">
                                    {quickActions.map((action) => (
                                      <Button
                                        key={action.id}
                                        variant="outline"
                                        size="sm"
                                        className="h-auto p-3 flex flex-col items-center space-y-1 border-brand-brown-200 dark:border-brand-brown-700 hover:bg-brand-brown-50 dark:hover:bg-brand-brown-800"
                                        onClick={() =>
                                          handleQuickAction(action.action)
                                        }
                                      >
                                        <action.icon className="h-4 w-4 text-brand-brown-600 dark:text-brand-beige-300" />
                                        <span className="text-xs text-center text-brand-brown-700 dark:text-brand-beige-200">
                                          {action.label}
                                        </span>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                                <p className="text-xs text-brand-brown-500 dark:text-brand-beige-400 mt-1">
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start space-x-3 justify-end">
                              <div className="flex-1 flex justify-end">
                                <div className="bg-gradient-to-br from-brand-brown-700 to-brand-brown-800 text-white p-3 rounded-2xl rounded-tr-sm max-w-xs">
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              </div>
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-brand-brown-600 to-brand-brown-800 text-brand-beige-100 text-sm">
                                  {user ? user.nome.charAt(0) : "U"}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-brand-brown-900 text-sm font-bold">
                              C
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gradient-to-br from-brand-brown-50 to-brand-beige-50 dark:from-brand-brown-800 dark:to-brand-brown-700 p-3 rounded-2xl rounded-tl-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-brand-brown-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-brand-brown-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-brand-brown-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t border-brand-brown-200 dark:border-brand-brown-700">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 border-brand-brown-200 dark:border-brand-brown-700 focus:border-brand-brown-500 rounded-xl"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-brand-brown-700 to-brand-brown-800 hover:from-brand-brown-800 hover:to-brand-brown-900 text-white rounded-xl px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-brand-brown-500 dark:text-brand-beige-400 mt-2 text-center">
                    Clara AI • Powered by Siqueira Campos Premium
                  </p>
                </div>
              </>
            )}
          </Card>
        ) : (
          <Button
            onClick={toggleOpen}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-brown-700 to-brand-brown-900 hover:from-brand-brown-800 hover:to-brand-brown-950 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 relative group"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                {unreadCount}
              </Badge>
            )}

            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-brand-brown-700/50 animate-ping"></div>
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          </Button>
        )}
      </div>

      {/* Floating notification when chat is closed */}
      {!isOpen && unreadCount > 0 && (
        <div className="fixed bottom-24 right-6 z-40">
          <div className="bg-white dark:bg-brand-brown-800 rounded-xl shadow-lg p-3 border border-brand-brown-200 dark:border-brand-brown-700 animate-bounce">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-brand-brown-800 dark:text-brand-beige-200">
                Nova mensagem da Clara!
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
