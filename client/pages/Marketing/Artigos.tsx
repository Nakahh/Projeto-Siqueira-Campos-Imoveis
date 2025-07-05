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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Tag,
  TrendingUp,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface Artigo {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  imagemDestaque: string;
  tags: string[];
  status: string;
  visualizacoes: number;
  destaque: boolean;
  publicadoEm: string;
  criadoEm: string;
  autor: {
    nome: string;
  };
}

export default function Artigos() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Artigo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Form states
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    resumo: "",
    imagemDestaque: "",
    tags: "",
    status: "RASCUNHO",
  });

  useEffect(() => {
    loadArtigos();
  }, []);

  const loadArtigos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/artigos/admin/lista", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArtigos(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar artigos:", error);
      toast.error("Erro ao carregar artigos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      const url = editingArticle
        ? `/api/artigos/${editingArticle.id}`
        : "/api/artigos";

      const method = editingArticle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          editingArticle
            ? "Artigo atualizado com sucesso!"
            : "Artigo criado com sucesso!",
        );
        setDialogOpen(false);
        setEditingArticle(null);
        resetForm();
        loadArtigos();
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao salvar artigo");
      }
    } catch (error) {
      console.error("Erro ao salvar artigo:", error);
      toast.error("Erro interno do servidor");
    }
  };

  const handleEdit = (artigo: Artigo) => {
    setEditingArticle(artigo);
    setFormData({
      titulo: artigo.titulo,
      conteudo: "", // Seria carregado da API completa
      resumo: artigo.resumo || "",
      imagemDestaque: artigo.imagemDestaque || "",
      tags: artigo.tags.join(", "),
      status: artigo.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este artigo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/artigos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Artigo deletado com sucesso!");
        loadArtigos();
      } else {
        toast.error("Erro ao deletar artigo");
      }
    } catch (error) {
      console.error("Erro ao deletar artigo:", error);
      toast.error("Erro interno do servidor");
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      conteudo: "",
      resumo: "",
      imagemDestaque: "",
      tags: "",
      status: "RASCUNHO",
    });
  };

  const filteredArtigos = artigos.filter((artigo) => {
    const matchesSearch = artigo.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "TODOS" || artigo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      RASCUNHO: "secondary",
      PUBLICADO: "default",
      ARQUIVADO: "destructive",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Artigos do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie os artigos do blog da imobiliária
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingArticle(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Editar Artigo" : "Novo Artigo"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RASCUNHO">Rascunho</SelectItem>
                      <SelectItem value="PUBLICADO">Publicado</SelectItem>
                      <SelectItem value="ARQUIVADO">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumo">Resumo</Label>
                <Textarea
                  id="resumo"
                  placeholder="Breve descrição do artigo..."
                  value={formData.resumo}
                  onChange={(e) =>
                    setFormData({ ...formData, resumo: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo">Conteúdo *</Label>
                <Textarea
                  id="conteudo"
                  placeholder="Conteúdo completo do artigo..."
                  value={formData.conteudo}
                  onChange={(e) =>
                    setFormData({ ...formData, conteudo: e.target.value })
                  }
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagemDestaque">
                  URL da Imagem de Destaque
                </Label>
                <Input
                  id="imagemDestaque"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.imagemDestaque}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      imagemDestaque: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  placeholder="imóveis, mercado, investimento"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
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
                <Button type="submit">
                  {editingArticle ? "Atualizar" : "Criar"} Artigo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="RASCUNHO">Rascunho</SelectItem>
            <SelectItem value="PUBLICADO">Publicado</SelectItem>
            <SelectItem value="ARQUIVADO">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Artigos
                </p>
                <p className="text-2xl font-bold">{artigos.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Publicados
                </p>
                <p className="text-2xl font-bold">
                  {artigos.filter((a) => a.status === "PUBLICADO").length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rascunhos
                </p>
                <p className="text-2xl font-bold">
                  {artigos.filter((a) => a.status === "RASCUNHO").length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Visualizações
                </p>
                <p className="text-2xl font-bold">
                  {artigos.reduce((total, a) => total + a.visualizacoes, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Artigos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Artigos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Publicado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtigos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nenhum artigo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArtigos.map((artigo) => (
                    <TableRow key={artigo.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{artigo.titulo}</div>
                          <div className="text-sm text-muted-foreground">
                            {artigo.resumo?.substring(0, 100)}...
                          </div>
                          {artigo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {artigo.tags.slice(0, 3).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(artigo.status)}</TableCell>
                      <TableCell>{artigo.visualizacoes}</TableCell>
                      <TableCell>
                        {artigo.publicadoEm
                          ? new Date(artigo.publicadoEm).toLocaleDateString(
                              "pt-BR",
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(artigo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(artigo.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
