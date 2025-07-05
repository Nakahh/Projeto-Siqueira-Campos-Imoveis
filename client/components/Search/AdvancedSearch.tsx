import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  Square,
  DollarSign,
  Calendar,
  ChevronDown,
  X,
  RefreshCw,
  Save,
  BookmarkPlus,
} from "lucide-react";
import { useFilters } from "@/contexts/AppStateContext";

interface SearchFilters {
  query: string;
  type: string[];
  transaction: string[];
  priceRange: [number, number];
  location: {
    cities: string[];
    neighborhoods: string[];
    radius: number;
  };
  features: {
    bedrooms: number[];
    bathrooms: number[];
    parking: number[];
    area: [number, number];
  };
  amenities: string[];
  tags: string[];
  sortBy: "price" | "date" | "area" | "relevance";
  sortOrder: "asc" | "desc";
}

const propertyTypes = [
  { id: "casa", label: "Casa", icon: Home },
  { id: "apartamento", label: "Apartamento", icon: Home },
  { id: "terreno", label: "Terreno", icon: Square },
  { id: "comercial", label: "Comercial", icon: Home },
  { id: "cobertura", label: "Cobertura", icon: Home },
  { id: "kitnet", label: "Kitnet", icon: Home },
];

const transactionTypes = [
  { id: "venda", label: "Venda" },
  { id: "aluguel", label: "Aluguel" },
  { id: "temporada", label: "Temporada" },
];

const neighborhoods = [
  "Setor Bueno",
  "Setor Oeste",
  "Setor Marista",
  "Jardim Goiás",
  "Setor Central",
  "Setor Sul",
  "Setor Aeroporto",
  "Vila Redenção",
  "Parque Amazônia",
  "Alto da Glória",
];

const amenities = [
  "Piscina",
  "Academia",
  "Churrasqueira",
  "Portaria 24h",
  "Elevador",
  "Varanda",
  "Jardim",
  "Garagem coberta",
  "Ar condicionado",
  "Mobiliado",
  "Pet friendly",
  "Área de lazer",
];

export function AdvancedSearch({
  isOpen,
  onClose,
  onSearch,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
}) {
  const { filters: contextFilters, updateFilters } = useFilters();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    type: [],
    transaction: [],
    priceRange: [0, 10000000],
    location: {
      cities: ["Goiânia"],
      neighborhoods: [],
      radius: 5,
    },
    features: {
      bedrooms: [],
      bathrooms: [],
      parking: [],
      area: [0, 1000],
    },
    amenities: [],
    tags: [],
    sortBy: "relevance",
    sortOrder: "desc",
  });

  const [savedSearches, setSavedSearches] = useState<any[]>([]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedFilterChange = (
    parent: string,
    key: string,
    value: any,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof SearchFilters],
        [key]: value,
      },
    }));
  };

  const handleArrayToggle = (key: string, value: any) => {
    setFilters((prev) => {
      const currentArray = prev[key as keyof SearchFilters] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      type: [],
      transaction: [],
      priceRange: [0, 10000000],
      location: {
        cities: ["Goiânia"],
        neighborhoods: [],
        radius: 5,
      },
      features: {
        bedrooms: [],
        bathrooms: [],
        parking: [],
        area: [0, 1000],
      },
      amenities: [],
      tags: [],
      sortBy: "relevance",
      sortOrder: "desc",
    });
  };

  const saveSearch = () => {
    const searchName = prompt("Nome para esta busca:");
    if (searchName) {
      const newSearch = {
        id: Date.now().toString(),
        name: searchName,
        filters: { ...filters },
        createdAt: Date.now(),
      };
      setSavedSearches((prev) => [...prev, newSearch]);
      localStorage.setItem(
        "siqueira-saved-searches",
        JSON.stringify([...savedSearches, newSearch]),
      );
    }
  };

  const applySearch = () => {
    updateFilters(filters);
    onSearch(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.type.length) count++;
    if (filters.transaction.length) count++;
    if (filters.location.neighborhoods.length) count++;
    if (filters.features.bedrooms.length) count++;
    if (filters.features.bathrooms.length) count++;
    if (filters.features.parking.length) count++;
    if (filters.amenities.length) count++;
    return count;
  };

  useEffect(() => {
    const saved = localStorage.getItem("siqueira-saved-searches");
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Busca Avançada
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Configure filtros detalhados para encontrar o imóvel ideal
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Buscar por palavra-chave</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-query"
                placeholder="Ex: apartamento com piscina..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Property Types */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-sm font-medium">Tipo de Imóvel</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => handleArrayToggle("type", type.id)}
                  >
                    <Checkbox
                      checked={filters.type.includes(type.id)}
                      onChange={() => handleArrayToggle("type", type.id)}
                    />
                    <type.icon className="h-4 w-4" />
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Transaction Type */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-sm font-medium">Finalidade</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {transactionTypes.map((transaction) => (
                  <Button
                    key={transaction.id}
                    variant={
                      filters.transaction.includes(transaction.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleArrayToggle("transaction", transaction.id)
                    }
                  >
                    {transaction.label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Price Range */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-sm font-medium">Faixa de Preço</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4">
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", value)
                  }
                  max={10000000}
                  min={0}
                  step={50000}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  R${" "}
                  {new Intl.NumberFormat("pt-BR").format(filters.priceRange[0])}
                </span>
                <span>
                  R${" "}
                  {new Intl.NumberFormat("pt-BR").format(filters.priceRange[1])}
                </span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Location */}
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-sm font-medium">Localização</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Bairros</Label>
                <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                  {neighborhoods.map((neighborhood) => (
                    <div
                      key={neighborhood}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={filters.location.neighborhoods.includes(
                          neighborhood,
                        )}
                        onChange={() =>
                          handleNestedFilterChange(
                            "location",
                            "neighborhoods",
                            filters.location.neighborhoods.includes(
                              neighborhood,
                            )
                              ? filters.location.neighborhoods.filter(
                                  (n) => n !== neighborhood,
                                )
                              : [
                                  ...filters.location.neighborhoods,
                                  neighborhood,
                                ],
                          )
                        }
                      />
                      <span className="text-sm">{neighborhood}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Features */}
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-sm font-medium">Características</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4">
              {/* Bedrooms */}
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  Quartos
                </Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={
                        filters.features.bedrooms.includes(num)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleNestedFilterChange(
                          "features",
                          "bedrooms",
                          filters.features.bedrooms.includes(num)
                            ? filters.features.bedrooms.filter((n) => n !== num)
                            : [...filters.features.bedrooms, num],
                        )
                      }
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Bath className="h-3 w-3" />
                  Banheiros
                </Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      variant={
                        filters.features.bathrooms.includes(num)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleNestedFilterChange(
                          "features",
                          "bathrooms",
                          filters.features.bathrooms.includes(num)
                            ? filters.features.bathrooms.filter(
                                (n) => n !== num,
                              )
                            : [...filters.features.bathrooms, num],
                        )
                      }
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>

              {/* Parking */}
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  Vagas
                </Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      variant={
                        filters.features.parking.includes(num)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleNestedFilterChange(
                          "features",
                          "parking",
                          filters.features.parking.includes(num)
                            ? filters.features.parking.filter((n) => n !== num)
                            : [...filters.features.parking, num],
                        )
                      }
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Amenities */}
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-sm font-medium">Comodidades</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <Checkbox
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleArrayToggle("amenities", amenity)}
                    />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <div className="flex gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc.</SelectItem>
                  <SelectItem value="asc">Asc.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar
            </Button>

            <Button variant="outline" onClick={saveSearch} size="sm">
              <Save className="h-4 w-4" />
            </Button>

            <Button onClick={applySearch} className="flex-1" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
