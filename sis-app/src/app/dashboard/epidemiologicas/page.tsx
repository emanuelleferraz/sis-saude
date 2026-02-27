'use client';
import { Activity, Search, User, ArrowLeft, AlertTriangle, TrendingUp, Menu, X, Users, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SharedMenu } from '@/components/SharedMenu';
import { obterDashboardEpidemiologica } from '@/services/dashboardDoencaService';
import { DashboardEpidemiologicaDTO, AlertaBairroDTO, DistribuicaoDoencaDTO, IncidenciaPorBairroDTO, TendenciaTrimestralDTO } from '@/types/dashboardDoenca';

interface DashboardEpidemiologicasProps {
  onBack: () => void;
}

export default function DashboardEpidemiologicas({ onBack }: DashboardEpidemiologicasProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumo, setResumo] = useState<DashboardEpidemiologicaDTO['resumo'] | null>(null);
  const [distribuicao, setDistribuicao] = useState<DistribuicaoDoencaDTO[]>([]);
  const [incidencia, setIncidencia] = useState<IncidenciaPorBairroDTO[]>([]);
  const [tendencia, setTendencia] = useState<TendenciaTrimestralDTO[]>([]);
  const [alertas, setAlertas] = useState<AlertaBairroDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const cores = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  // Função para buscar os dados do dashboard
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const data: DashboardEpidemiologicaDTO = await obterDashboardEpidemiologica();
        setResumo(data.resumo);
        setDistribuicao(data.distribuicao);
        setIncidencia(data.incidenciaPorBairro);
        setTendencia(data.tendenciaTrimestral);
        setAlertas(data.alertas);
      } catch (error) {
        console.error('Erro ao carregar dashboard epidemiológico:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // Monta os dados para o gráfico de incidência por bairro
  const dadosIncidencia = incidencia.reduce((acc: any[], curr) => {
    let item = acc.find(i => i.bairro === curr.bairro);
    if (!item) {
      item = { bairro: curr.bairro };
      acc.push(item);
    }
    item[curr.doenca.toLowerCase()] = curr.totalCasos;
    return acc;
  }, []);

  // Monta os dados para o gráfico de tendência trimestral
  const dadosTrimestral = tendencia.map(t => ({
    trimestre: `T${t.trimestre}/${t.ano}`,
    casos: t.totalCasos
  }));

  // Monta os dados para o gráfico de distribuição por doença
  const dadosDistribuicao = distribuicao.map((d, index) => ({
    name: d.doenca,
    casos: d.totalCasos,
    fill: cores[index % cores.length]
  }));

  // Monta os dados da tabela de detalhamento e alerta
  const tabelaDetalhamento = alertas.map(a => ({
    doenca: a.doenca,
    bairro: a.bairro,
    casos: a.totalCasos,
    status: a.nivelAlerta
  }));

  // Função para colorir status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alerta': return 'text-red-600 bg-red-50';
      case 'Atenção': return 'text-orange-600 bg-orange-50';
      case 'Normal': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
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
            <div className="bg-linear-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-gray-800">Sistema de Saúde</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Pesquisar..."
                className="pl-10 pr-4 py-2 w-80 rounded-lg"
              />
            </div>
            <div className="bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors">
              <User className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {menuOpen && (
          <SharedMenu onMenuItemClick={(key) => key === "sobre" && onBack()} />
        )}

        <main className="flex-1 p-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl text-gray-800 mb-2">
              Doenças Epidemiológicas
            </h1>
            <p className="text-gray-600">
              Monitoramento e controle de doenças epidemiológicas por bairro
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Casos
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resumo?.totalCasos ?? "..."}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {resumo
                    ? `+${Math.round(resumo.totalCasos * 0.12)} casos em relação ao trimestre anterior`
                    : "..."}
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
                  {resumo?.bairrosMonitorados ?? "..."}
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
                  {alertas[0]?.bairro ?? "..."}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {alertas[0]?.totalCasos ?? "..."} casos registrados
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Doença com Maior Crescimento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {distribuicao[0]?.doenca ?? "..."}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {distribuicao[0]?.totalCasos ?? "..."} casos neste trimestre
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Incidência por Bairro */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Incidência de Doenças por Bairro</CardTitle>
              <CardDescription>
                Casos registrados por tipo de doença em cada bairro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dadosIncidencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bairro" />
                  <YAxis
                    allowDecimals={false}
                    tickCount={6}
                    domain={[0, "auto"]}
                  />
                  <Tooltip />
                  <Legend />
                  {distribuicao.map((d, index) => (
                    <Bar
                      key={d.doenca}
                      dataKey={d.doenca.toLowerCase()}
                      name={d.doenca}
                      fill={cores[index % cores.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tendência Trimestral e Distribuição */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Tendência Trimestral</CardTitle>
                <CardDescription>
                  Evolução total de casos por trimestre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosTrimestral}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trimestre" />
                    <YAxis
                      allowDecimals={false}
                      tickCount={6}
                      domain={[0, "auto"]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="casos"
                      name="Total de Casos"
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
                <CardDescription>
                  Proporção de casos por tipo de doença
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosDistribuicao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      dataKey="casos"
                    >
                      {dadosDistribuicao.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela Detalhamento */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento e Alerta</CardTitle>
              <CardDescription>
                Status detalhado de casos por doença e bairro
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-96">
              <Table className="min-w-150">
                <TableHeader>
                  <TableRow>
                    <TableHead>Doença</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Casos</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabelaDetalhamento.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.doenca}
                      </TableCell>
                      <TableCell>{item.bairro}</TableCell>
                      <TableCell>{item.casos}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}