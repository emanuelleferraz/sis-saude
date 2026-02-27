'use client';
import { Activity, Search, User, ArrowLeft, Syringe, Menu, X, Users, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SharedMenu } from '@/components/SharedMenu';
import { obterDashboardVacina } from '@/services/dashboardVacinaService';
import { useRouter } from "next/navigation";
import { DashboardVacinaDTO, CoberturaVacinalBairroDTO, DistribuicaoVacinaDTO, EvolucaoDosesTrimestreDTO, AplicacaoPorUnidadeDTO, CardResumoVacinaDTO } from '@/types/dashboardVacina';

interface DashboardVacinacaoProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function DashboardVacinacao({ onBack, onNavigate }: DashboardVacinacaoProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumo, setResumo] = useState<CardResumoVacinaDTO | null>(null);
  const [coberturaBairros, setCoberturaBairros] = useState<CoberturaVacinalBairroDTO[]>([]);
  const [distribuicaoDoses, setDistribuicaoDoses] = useState<DistribuicaoVacinaDTO[]>([]);
  const [evolucaoTrimestral, setEvolucaoTrimestral] = useState<EvolucaoDosesTrimestreDTO[]>([]);
  const [aplicacoesUnidade, setAplicacoesUnidade] = useState<AplicacaoPorUnidadeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const cores = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const data: DashboardVacinaDTO = await obterDashboardVacina();
        setResumo(data.resumo);
        setCoberturaBairros(data.coberturaPorBairro);
        setDistribuicaoDoses(data.distribuicaoVacinas);
        setEvolucaoTrimestral(data.evolucaoTrimestral);
        setAplicacoesUnidade(data.aplicacoesPorUnidade);
      } catch (error) {
        console.error('Erro ao carregar dashboard de vacinas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // Calculo das doses da vacina mais aplicada
  const vacinaMaisAplicada = distribuicaoDoses.length > 0
  ? distribuicaoDoses.reduce((prev, curr) =>
      curr.totalAplicacoes > prev.totalAplicacoes ? curr : prev
    )
  : null;

  // Agrupar dados da tabela por unidade e vacinas
  const tabelaUnidades = aplicacoesUnidade.reduce((acc: Record<string, Record<string, number>>, curr) => {
    if (!acc[curr.unidade]) acc[curr.unidade] = {};
    acc[curr.unidade][curr.vacina] = curr.totalAplicacoes;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Lista de vacinas presentes para gerar as colunas
  const vacinasTabela = Array.from(
    new Set(aplicacoesUnidade.map((item) => item.vacina))
  );

    function handleMenuClick(key: string) {
      router.push(`/${key}`);
    }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
            <div className="bg-linear-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-gray-800">Sistema de Saúde</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Pesquisar..." className="pl-10 pr-4 py-2 w-80 rounded-lg" />
            </div>
            <div className="bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors">
              <User className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Menu lateral */}
        {menuOpen && <SharedMenu onMenuItemClick={handleMenuClick} />}

        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          <Button onClick={() => router.push("/home")} variant="ghost" className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl text-gray-800 mb-2">Controle de Vacinação</h1>
            <p className="text-gray-600">Monitoramento da cobertura vacinal por bairro e unidade PSF</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pessoas Vacinadas</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumo?.pessoasVacinadas ?? '...'}</div>
                <p className="text-xs text-gray-600 mt-1">Total de pessoas vacinadas</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Doses Aplicadas</CardTitle>
                <Syringe className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumo?.dosesAplicadas ?? '...'}</div>
                <p className="text-xs text-gray-600 mt-1">Total de doses aplicadas</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Vacina Mais Aplicada</CardTitle>
                <Syringe className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumo?.vacinaMaisAplicada ?? '...'}</div>
                <p className="text-xs text-gray-600 mt-1">{vacinaMaisAplicada?.totalAplicacoes ?? '...'} doses aplicadas</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bairro com Menor Cobertura</CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumo?.bairroMenorCobertura ?? '...'}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {coberturaBairros.find(b => b.bairro === resumo?.bairroMenorCobertura)?.totalAplicacoes ?? '...'} doses aplicadas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Cobertura por Bairro */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cobertura Vacinal por Bairro</CardTitle>
              <CardDescription>Doses aplicadas em cada bairro</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={coberturaBairros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bairro" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalAplicacoes" name="Total Aplicações" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição e Evolução */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Doses Aplicadas por Vacina</CardTitle>
                <CardDescription>Proporção de doses por tipo de vacina</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribuicaoDoses.map(d => ({ name: d.nomeVacina, doses: d.totalAplicacoes, fill: '#3b82f6' }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="doses"
                    >
                      {distribuicaoDoses.map((entry, index) => (
                        <Cell key={index} fill={cores[index % cores.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Trimestral</CardTitle>
                <CardDescription>Total de doses aplicadas por trimestre</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolucaoTrimestral.map(e => ({ trimestre: `T${e.trimestre}/${e.ano}`, doses: e.totalDoses }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trimestre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="doses" name="Total de Doses" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela Aplicações por Unidade com scroll */}
          <Card>
            <CardHeader>
              <CardTitle>Aplicação de Vacinas por Unidade PSF</CardTitle>
              <CardDescription>Detalhamento de doses aplicadas por unidade e tipo de vacina</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto max-h-100">
              <Table className="min-w-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Unidade PSF</TableHead>
                    {vacinasTabela.map((vacina) => (
                      <TableHead key={vacina}>{vacina}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(tabelaUnidades).map(([unidade, vacinas]) => (
                    <TableRow key={unidade}>
                      <TableCell className="font-medium">{unidade}</TableCell>
                      {vacinasTabela.map((vacina) => (
                        <TableCell key={vacina}>{vacinas[vacina] ?? 0}</TableCell>
                      ))}
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