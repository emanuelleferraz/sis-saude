"use client";

import {
  Activity,
  Search,
  User,
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  Menu,
  X,
  Users,
  MapPin,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SharedMenu } from "@/components/SharedMenu";
import { obterDashboardCronica } from "@/services/dashboardDoencaService";
import { DashboardCronicaDTO } from "@/types/dashboardDoenca";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

interface DashboardCronicasProps {
  onBack: () => void;
}

const CORES = [
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function DashboardCronicas({ onBack }: DashboardCronicasProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [dados, setDados] = useState<DashboardCronicaDTO | null>(null);
    // Filtro de Bairros
  const [bairroFiltro, setBairroFiltro] = useState<string>('todos');
  const router = useRouter();

  useEffect(() => {
    async function carregar() {
      try {
        const response = await obterDashboardCronica();
        setDados(response);
      } catch (error) {
        console.error("Erro ao carregar dashboard crônicas:", error);
      }
    }

    carregar();
  }, []);

  if (!dados) return null;

  const {
    resumo,
    distribuicao,
    incidenciaPorBairro,
    tendenciaTrimestral,
    alertas,
  } = dados;
  

  // Normalizador para chave dinâmica do gráfico
  const normalizar = (texto: string) =>
    texto
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

  // Monta estrutura do gráfico de barras
  const dadosIncidencia = incidenciaPorBairro.reduce((acc: any[], curr) => {
    const chave = normalizar(curr.doenca);

    let item = acc.find((i) => i.bairro === curr.bairro);

    if (!item) {
      item = { bairro: curr.bairro };
      acc.push(item);
    }

    item[chave] = curr.totalCasos;

    return acc;
  }, []);

  // Tendência formatada
  const dadosTrimestral = tendenciaTrimestral.map((t) => ({
    trimestre: `T${t.trimestre}/${t.ano}`,
    totalCasos: t.totalCasos,
  }));

  // Bairro com maior incidência
  const bairroMaisCritico =
    incidenciaPorBairro.length > 0
      ? incidenciaPorBairro.reduce((prev, current) =>
          prev.totalCasos > current.totalCasos ? prev : current,
        )
      : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Alerta":
        return "text-red-600 bg-red-50";
      case "Atenção":
        return "text-orange-600 bg-orange-50";
      case "Normal":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Total geral para calcular porcentagem
  const totalDistribuicao = distribuicao.reduce(
    (acc, item) => acc + item.totalCasos,
    0,
  );

  // Dados formatados em porcentagem
  const dadosPie = distribuicao.map((item) => ({
    ...item,
    porcentagem:
      totalDistribuicao > 0
        ? Number(((item.totalCasos / totalDistribuicao) * 100).toFixed(1))
        : 0,
  }));

  const bairrosUnicos = Array.from(new Set(alertas.map((item) => item.bairro)));
  const alertasFiltrados =
    bairroFiltro === "todos"
      ? alertas
      : alertas.filter((item) => item.bairro === bairroFiltro);

        function handleMenuClick(key: string) {
          router.push(`/${key}`);
        }


  return (
    <AuthGuard>
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
              {/* Logo */}
              <img src="/logo.png" alt="Logo Vitalis" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      <div className="flex">
        {menuOpen && (
          <SharedMenu onMenuItemClick={handleMenuClick} />
        )}

        <main className="flex-1 p-8">
          <Button
            onClick={() => router.push("/home")}
            variant="ghost"
            className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl text-gray-800 mb-2">Doenças Crônicas</h1>
            <p className="text-gray-600">
              Monitoramento e controle de doenças crônicas por bairro
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Casos
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumo.totalCasos}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {resumo.casosPeriodos} no período
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Bairros Monitorados
                </CardTitle>
                <MapPin className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resumo.bairrosMonitorados}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Cobertura total da cidade
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Bairro com Maior Incidência
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bairroMaisCritico?.bairro ?? "-"}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {bairroMaisCritico?.totalCasos ?? 0} casos registrados
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pacientes Únicos
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resumo.pacientesUnicos}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Total de pacientes distintos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* GRÁFICO BARRAS */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Incidência de Doenças por Bairro</CardTitle>
              <CardDescription>
                Casos registrados por tipo de doença em cada bairro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosIncidencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bairro" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {distribuicao.map((d, index) => (
                      <Bar
                        key={d.doenca}
                        dataKey={normalizar(d.doenca)}
                        name={d.doenca}
                        fill={CORES[index % CORES.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* LINHA + PIE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Tendência Trimestral</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosTrimestral}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trimestre" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalCasos"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Doença</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosPie}
                      dataKey="porcentagem"
                      nameKey="doenca"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {dadosPie.map((_, index) => (
                        <Cell key={index} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* TABELA */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento e Alerta</CardTitle>
              <CardDescription>
                Status detalhado de casos por doença e bairro
              </CardDescription>
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Filtrar por bairro:
                </label>

                <select
                  value={bairroFiltro}
                  onChange={(e) => setBairroFiltro(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  {bairrosUnicos.map((bairro) => (
                    <option key={bairro} value={bairro}>
                      {bairro}
                    </option>
                  ))}
                </select>
            </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-100 overflow-y-auto overflow-x-auto">
                <Table className="min-w-175">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doença</TableHead>
                      <TableHead>Bairro</TableHead>
                      <TableHead>Casos</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertasFiltrados.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.doenca}
                        </TableCell>
                        <TableCell>{item.bairro}</TableCell>
                        <TableCell>{item.totalCasos}</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              item.nivelAlerta,
                            )}`}
                          >
                            {item.nivelAlerta}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
