import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Depoimento {
  id: number;
  nome: string;
  conteudo: string;
  nota: number;
  foto: string;
  cidade: string;
  aprovado: boolean;
  destaque: boolean;
  criadoEm: string;
  imovel?: {
    titulo: string;
    endereco: string;
    bairro: string;
  };
}

interface Imovel {
  id: number;
  titulo: string;
  endereco: string;
  bairro: string;
}

export default function Depoimentos() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    foto: "",
    conteudo: "",
    nota: 5,
    cidade: "",
    imovelId: "",
  });

  useEffect(() => {
    loadDepoimentos();
    loadImoveis();
  }, []);

  const loadDepoimentos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/depoimentos/meus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDepoimentos(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error);
      toast.error("Erro ao carregar depoimentos");
    } finally {
      setLoading(false);
    }
  };

  const loadImoveis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/cliente/imoveis-visitados", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImoveis(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        imovelId: formData.imovelId ? parseInt(formData.imovelId) : null,
      };

      const response = await fetch("/api/depoimentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Depoimento enviado! Aguardando aprovação.");
        setDialogOpen(false);
        resetForm();
        loadDepoimentos();
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao enviar depoimento");
      }
    } catch (error) {
      console.error("Erro ao enviar depoimento:", error);
      toast.error("Erro interno do servidor");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      foto: "",
      conteudo: "",
      nota: 5,
      cidade: "",
      imovelId: "",
    });
  };

  const renderStars = (
    nota: number,
    interactive = false,
    onChange?: (rating: number) => void,
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (depoimento: Depoimento) => {
    if (!depoimento.aprovado) {
      return (
        <Badge variant="secondary" className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Aguardando Aprovação
        </Badge>
      );
    }

    if (depoimento.destaque) {
      return (
        <Badge className="flex items-center bg-yellow-500">
          <Star className="h-3 w-3 mr-1" />
          Destaque
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="flex items-center">
        <CheckCircle className="h-3 w-3 mr-1" />
        Aprovado
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Depoimentos</h1>
          <p className="text-muted-foreground">
            Compartilhe sua experiência conosco
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Depoimento
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Depoimento</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome (opcional)</Label>
                <Input
                  id="nome"
                  placeholder="Deixe em branco para usar seu nome cadastrado"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Deixe em branco para usar seu email cadastrado"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto">URL da Foto (opcional)</Label>
                <Input
                  id="foto"
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  value={formData.foto}
                  onChange={(e) =>
                    setFormData({ ...formData, foto: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Ex: Goiânia - GO"
                  value={formData.cidade}
                  onChange={(e) =>
                    setFormData({ ...formData, cidade: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imovel">Imóvel (opcional)</Label>
                <Select
                  value={formData.imovelId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, imovelId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um imóvel (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum imóvel específico</SelectItem>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id.toString()}>
                        {imovel.titulo} - {imovel.bairro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nota *</Label>
                {renderStars(formData.nota, true, (nota) =>
                  setFormData({ ...formData, nota }),
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo">Depoimento *</Label>
                <Textarea
                  id="conteudo"
                  placeholder="Conte sobre sua experiência conosco..."
                  value={formData.conteudo}
                  onChange={(e) =>
                    setFormData({ ...formData, conteudo: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Enviar Depoimento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Depoimentos */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : depoimentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum depoimento ainda
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Compartilhe sua experiência conosco criando seu primeiro
              depoimento.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Depoimento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {depoimentos.map((depoimento) => (
            <Card key={depoimento.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {depoimento.foto && (
                      <img
                        src={depoimento.foto}
                        alt={depoimento.nome}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {depoimento.nome}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {renderStars(depoimento.nota)}
                        {depoimento.cidade && (
                          <span className="text-sm text-muted-foreground">
                            • {depoimento.cidade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(depoimento)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {depoimento.conteudo}
                </p>

                {depoimento.imovel && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium">Sobre o imóvel:</p>
                    <p className="text-sm text-muted-foreground">
                      {depoimento.imovel.titulo} - {depoimento.imovel.endereco},{" "}
                      {depoimento.imovel.bairro}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Enviado em{" "}
                    {new Date(depoimento.criadoEm).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
