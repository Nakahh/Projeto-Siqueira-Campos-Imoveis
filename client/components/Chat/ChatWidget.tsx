import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nome: "",
    telefone: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserInfo({
        nome: user.nome,
        telefone: user.whatsapp || "",
        email: user.email,
      });
      setShowForm(false);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initialMessage: Message = {
    id: "1",
    content:
      "Olá! Sou a assistente virtual da Siqueira Campos Imóveis. Como posso ajudá-lo hoje?",
    sender: "bot",
    timestamp: new Date(),
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
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

    try {
      // Simular delay de digitação
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Enviar para API de chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          userInfo: showForm ? null : userInfo,
          context: "website",
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.response || "Desculpe, não consegui processar sua mensagem.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, ocorreu um erro. Tente novamente.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.nome && userInfo.telefone) {
      setShowForm(false);
      setMessages([
        initialMessage,
        {
          id: "2",
          content: `Prazer em conhecê-lo, ${userInfo.nome}! Agora posso ajudá-lo melhor. O que você gostaria de saber sobre nossos imóveis?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(
      `Olá! Vim do site da Siqueira Campos Imóveis e gostaria de falar sobre imóveis.`,
    );
    window.open(`https://wa.me/5562985563505?text=${message}`, "_blank");
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-brown-700 hover:bg-brand-brown-800 text-white shadow-lg z-50 animate-pulse"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 transition-all duration-300 ${
        isMinimized ? "h-14" : "h-96"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-brand-brown-700 text-white rounded-t-lg">
        <CardTitle className="text-sm font-medium">
          {isMinimized ? "Chat - Siqueira Campos" : "Assistente Virtual"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-brand-brown-600"
            onClick={() => setIsMinimized(!isMinimized)}
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
            className="h-6 w-6 text-white hover:bg-brand-brown-600"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 h-80 flex flex-col">
          {showForm ? (
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">
                Para começar, me conte um pouco sobre você:
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <Input
                  placeholder="Seu nome"
                  value={userInfo.nome}
                  onChange={(e) =>
                    setUserInfo((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  required
                />
                <Input
                  placeholder="Seu telefone"
                  value={userInfo.telefone}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      telefone: e.target.value,
                    }))
                  }
                  required
                />
                <Input
                  placeholder="Seu email (opcional)"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <Button type="submit" className="w-full bg-brand-brown-700">
                  Iniciar Conversa
                </Button>
              </form>
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleWhatsAppRedirect}
                  className="w-full"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === "user"
                              ? "bg-brand-brown-700 ml-2"
                              : "bg-brand-beige-500 mr-2"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-brand-brown-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-brand-beige-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-brand-brown-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
