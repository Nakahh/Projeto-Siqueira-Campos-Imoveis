import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  Home,
  DollarSign,
  Calendar,
  TrendingUp,
  Info,
  Phone,
  MessageCircle,
  Download,
  Share2,
} from "lucide-react";

interface SimulationData {
  valorImovel: number;
  entrada: number;
  prazoAnos: number;
  taxaJuros: number;
  sistemaAmortizacao: "SAC" | "PRICE";
  renda: number;
  tipoFinanciamento: string;
}

interface SimulationResult {
  valorFinanciado: number;
  parcela: number;
  totalJuros: number;
  totalPagar: number;
  comprometimentoRenda: number;
  aprovado: boolean;
  tabela: Array<{
    parcela: number;
    saldoDevedor: number;
    amortizacao: number;
    juros: number;
    valorParcela: number;
  }>;
}

export default function SimuladorFinanciamento() {
  const [formData, setFormData] = useState<SimulationData>({
    valorImovel: 300000,
    entrada: 60000,
    prazoAnos: 30,
    taxaJuros: 9.5,
    sistemaAmortizacao: "SAC",
    renda: 8000,
    tipoFinanciamento: "SFH",
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    calculateFinancing();
  }, [formData]);

  const calculateFinancing = () => {
    const {
      valorImovel,
      entrada,
      prazoAnos,
      taxaJuros,
      sistemaAmortizacao,
      renda,
    } = formData;

    const valorFinanciado = valorImovel - entrada;
    const prazoMeses = prazoAnos * 12;
    const taxaMensal = taxaJuros / 100 / 12;

    let parcela: number;
    let totalJuros: number;
    let tabela: Array<{
      parcela: number;
      saldoDevedor: number;
      amortizacao: number;
      juros: number;
      valorParcela: number;
    }> = [];

    if (sistemaAmortizacao === "PRICE") {
      // Sistema PRICE (francês)
      parcela =
        (valorFinanciado *
          (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses))) /
        (Math.pow(1 + taxaMensal, prazoMeses) - 1);

      let saldoDevedor = valorFinanciado;
      totalJuros = 0;

      for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const amortizacao = parcela - juros;
        saldoDevedor -= amortizacao;
        totalJuros += juros;

        tabela.push({
          parcela: i,
          saldoDevedor: Math.max(0, saldoDevedor),
          amortizacao,
          juros,
          valorParcela: parcela,
        });
      }
    } else {
      // Sistema SAC
      const amortizacaoFixa = valorFinanciado / prazoMeses;
      let saldoDevedor = valorFinanciado;
      totalJuros = 0;

      for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const valorParcela = amortizacaoFixa + juros;
        saldoDevedor -= amortizacaoFixa;
        totalJuros += juros;

        tabela.push({
          parcela: i,
          saldoDevedor: Math.max(0, saldoDevedor),
          amortizacao: amortizacaoFixa,
          juros,
          valorParcela,
        });
      }

      parcela = tabela[0].valorParcela; // Primeira parcela (maior no SAC)
    }

    const totalPagar = valorFinanciado + totalJuros;
    const comprometimentoRenda = (parcela / renda) * 100;
    const aprovado = comprometimentoRenda <= 30; // Regra dos 30%

    setResult({
      valorFinanciado,
      parcela,
      totalJuros,
      totalPagar,
      comprometimentoRenda,
      aprovado,
      tabela,
    });
  };

  const handleChange = (
    field: keyof SimulationData,
    value: number | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const tiposFinanciamento = [
    { value: "SFH", label: "SFH - Sistema Financeiro da Habitação" },
    { value: "SFI", label: "SFI - Sistema Financeiro Imobiliário" },
    { value: "FGTS", label: "Financiamento com FGTS" },
    { value: "Consorcio", label: "Consórcio Imobiliário" },
  ];

  const bancos = [
    { nome: "Caixa Econômica Federal", taxa: "8.5-11.5%" },
    { nome: "Banco do Brasil", taxa: "9.0-12.0%" },
    { nome: "Itaú", taxa: "9.5-12.5%" },
    { nome: "Bradesco", taxa: "9.5-12.5%" },
    { nome: "Santander", taxa: "9.0-12.0%" },
    { nome: "Banco Inter", taxa: "8.9-11.9%" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simulador de Financiamento
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Calcule sua parcela e descubra quanto você pode financiar para
            comprar seu imóvel dos sonhos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Simulação */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Dados para Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Valor do Imóvel */}
                <div>
                  <Label className="text-base font-medium">
                    Valor do Imóvel
                  </Label>
                  <div className="mt-2">
                    <Input
                      type="number"
                      value={formData.valorImovel}
                      onChange={(e) =>
                        handleChange("valorImovel", parseFloat(e.target.value))
                      }
                      className="text-lg"
                    />
                    <Slider
                      value={[formData.valorImovel]}
                      onValueChange={([value]) =>
                        handleChange("valorImovel", value)
                      }
                      max={2000000}
                      min={50000}
                      step={10000}
                      className="mt-3"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>R$ 50.000</span>
                      <span>R$ 2.000.000</span>
                    </div>
                  </div>
                </div>

                {/* Valor da Entrada */}
                <div>
                  <Label className="text-base font-medium">
                    Valor da Entrada (
                    {((formData.entrada / formData.valorImovel) * 100).toFixed(
                      1,
                    )}
                    %)
                  </Label>
                  <div className="mt-2">
                    <Input
                      type="number"
                      value={formData.entrada}
                      onChange={(e) =>
                        handleChange("entrada", parseFloat(e.target.value))
                      }
                      className="text-lg"
                    />
                    <Slider
                      value={[formData.entrada]}
                      onValueChange={([value]) =>
                        handleChange("entrada", value)
                      }
                      max={formData.valorImovel * 0.8}
                      min={formData.valorImovel * 0.2}
                      step={5000}
                      className="mt-3"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>20% mínimo</span>
                      <span>80% máximo</span>
                    </div>
                  </div>
                </div>

                {/* Prazo e Taxa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium">
                      Prazo (anos)
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="number"
                        value={formData.prazoAnos}
                        onChange={(e) =>
                          handleChange("prazoAnos", parseFloat(e.target.value))
                        }
                        min={5}
                        max={35}
                      />
                      <Slider
                        value={[formData.prazoAnos]}
                        onValueChange={([value]) =>
                          handleChange("prazoAnos", value)
                        }
                        max={35}
                        min={5}
                        step={1}
                        className="mt-3"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Taxa de Juros (% ao ano)
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.taxaJuros}
                        onChange={(e) =>
                          handleChange("taxaJuros", parseFloat(e.target.value))
                        }
                        min={6}
                        max={15}
                      />
                      <Slider
                        value={[formData.taxaJuros]}
                        onValueChange={([value]) =>
                          handleChange("taxaJuros", value)
                        }
                        max={15}
                        min={6}
                        step={0.1}
                        className="mt-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Renda e Sistema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium">
                      Renda Familiar Bruta
                    </Label>
                    <Input
                      type="number"
                      value={formData.renda}
                      onChange={(e) =>
                        handleChange("renda", parseFloat(e.target.value))
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Sistema de Amortização
                    </Label>
                    <Select
                      value={formData.sistemaAmortizacao}
                      onValueChange={(value: "SAC" | "PRICE") =>
                        handleChange("sistemaAmortizacao", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAC">
                          SAC - Parcelas Decrescentes
                        </SelectItem>
                        <SelectItem value="PRICE">
                          PRICE - Parcelas Fixas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tipo de Financiamento */}
                <div>
                  <Label className="text-base font-medium">
                    Tipo de Financiamento
                  </Label>
                  <Select
                    value={formData.tipoFinanciamento}
                    onValueChange={(value) =>
                      handleChange("tipoFinanciamento", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposFinanciamento.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Resultado da Simulação
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-brand-brown-50 dark:bg-brand-brown-900 rounded-lg">
                      <div className="text-2xl font-bold text-brand-brown-700">
                        {formatCurrency(result.valorFinanciado)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Valor Financiado
                      </div>
                    </div>

                    <div className="text-center p-4 bg-brand-beige-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-brand-brown-700">
                        {formatCurrency(result.parcela)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.sistemaAmortizacao === "SAC"
                          ? "1ª Parcela"
                          : "Parcela Fixa"}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {formatCurrency(result.totalJuros)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total de Juros
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {result.comprometimentoRenda.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        da Renda
                      </div>
                    </div>
                  </div>

                  {/* Status de Aprovação */}
                  <div
                    className={`p-4 rounded-lg mb-4 ${
                      result.aprovado
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          result.aprovado ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold">
                          {result.aprovado
                            ? "Financiamento Viável"
                            : "Atenção: Comprometimento Alto"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.aprovado
                            ? "Seu comprometimento de renda está dentro do recomendado (até 30%)"
                            : "Comprometimento acima de 30% pode dificultar a aprovação"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botão da Tabela */}
                  <Button
                    onClick={() => setShowTable(!showTable)}
                    variant="outline"
                    className="w-full"
                  >
                    {showTable ? "Ocultar" : "Ver"} Tabela de Parcelas
                  </Button>

                  {/* Tabela de Parcelas */}
                  {showTable && (
                    <div className="mt-6 max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                          <tr>
                            <th className="px-2 py-2 text-left">Parcela</th>
                            <th className="px-2 py-2 text-right">Valor</th>
                            <th className="px-2 py-2 text-right">Juros</th>
                            <th className="px-2 py-2 text-right">
                              Amortização
                            </th>
                            <th className="px-2 py-2 text-right">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.tabela.slice(0, 12).map((row) => (
                            <tr
                              key={row.parcela}
                              className="border-b border-gray-200 dark:border-gray-700"
                            >
                              <td className="px-2 py-2">{row.parcela}</td>
                              <td className="px-2 py-2 text-right">
                                {formatCurrency(row.valorParcela)}
                              </td>
                              <td className="px-2 py-2 text-right">
                                {formatCurrency(row.juros)}
                              </td>
                              <td className="px-2 py-2 text-right">
                                {formatCurrency(row.amortizacao)}
                              </td>
                              <td className="px-2 py-2 text-right">
                                {formatCurrency(row.saldoDevedor)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.tabela.length > 12 && (
                        <p className="text-center text-sm text-gray-500 mt-2">
                          Mostrando primeiras 12 parcelas de{" "}
                          {result.tabela.length}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações dos Bancos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Taxas dos Bancos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bancos.map((banco, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="font-medium">{banco.nome}</span>
                      <span className="text-brand-brown-700">{banco.taxa}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <Info className="h-4 w-4 inline mr-1" />
                    Taxas podem variar conforme perfil do cliente
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Dicas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold">Entrada Mínima</h4>
                  <p className="text-gray-600">
                    A maioria dos bancos exige 20% de entrada do valor do
                    imóvel.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Comprometimento de Renda</h4>
                  <p className="text-gray-600">
                    Recomendamos não comprometer mais de 30% da renda familiar.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Sistema SAC vs PRICE</h4>
                  <p className="text-gray-600">
                    SAC: parcelas decrescentes, menos juros no total. PRICE:
                    parcelas fixas, mais juros no total.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Use o FGTS</h4>
                  <p className="text-gray-600">
                    O FGTS pode ser usado como entrada ou para amortizar o
                    financiamento.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Nossa equipe especializada pode te ajudar a encontrar as
                  melhores condições de financiamento.
                </p>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    window.open("https://wa.me/5562985563505", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar no WhatsApp
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Ligar para (62) 9 8556-3505
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>Importante:</strong> Esta é uma simulação aproximada. Os
            valores finais podem variar conforme análise de crédito, taxas
            específicas do banco e condições do financiamento. Procure sempre um
            especialista para orientação personalizada.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
