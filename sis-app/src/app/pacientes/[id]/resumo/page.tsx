"use client";
import {
  Activity,
  Search,
  User,
  Menu,
  X,
  Home,
  FileText,
  Calendar,
  Syringe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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
import { PacienteResumoDTO } from "@/types/pacienteResumo";
import { getPacienteResumo } from "@/services/pacienteResumoService";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";


export default function ResumoPacientePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const router = useRouter();


  const pacienteId = Number(params.id);

  const [resumoPaciente, setResumoPaciente] =
    useState<PacienteResumoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const consultas = resumoPaciente?.consultas ?? [];
  const vacinas = resumoPaciente?.vacinas ?? [];
  const visitas = resumoPaciente?.visitas ?? [];

 useEffect(() => {
   async function fetchResumo() {
     try {
       if (!pacienteId) return;

       setLoading(true);
       setError("");

       const data = await getPacienteResumo(pacienteId);

       if (!data) {
         setError("Paciente não encontrado.");
       } else {
         setResumoPaciente(data);
       }
     } catch (err) {
       console.error(err);
       setError("Erro ao carregar resumo do paciente.");
     } finally {
       setLoading(false);
     }
   }

   fetchResumo();
 }, [pacienteId]);

    if (loading) return <p>Carregando...</p>;

    if (error) return <p className="text-red-500">{error}</p>;

    if (!resumoPaciente) return <p>Nenhum dado encontrado.</p>;

    function formatCPF(cpf: string | undefined) {
      if (!cpf) return "-";

      const cleaned = cpf.replace(/\D/g, "").padStart(11, "0");

      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function formatDateOnly(dateString: string | undefined) {
        if (!dateString) return "-";

        const [year, month, day] = dateString.split("-");

        return `${day}/${month}/${year}`;
    }

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
              {/* Logo */}
              <img src="/logo.png" alt="Logo Vitalis" className="h-10 w-auto" />
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
        {/* Menu lateral */}
        {menuOpen && (
          <SharedMenu
            onMenuItemClick={(key) => {
              if (key === "pacientes") {
                router.push("/pacientes");
              }
            }}
          />
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          {/* Botão Voltar */}
          <Button
            onClick={() => router.push("/pacientes")}
            variant="ghost"
            className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar para Pacientes
          </Button>

          {/* Card de Dados do Paciente */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl text-gray-800">Resumo do Paciente</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nome Completo</p>
                <p className="text-gray-800">{resumoPaciente?.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">CPF</p>
                <p className="text-gray-800">{formatCPF(resumoPaciente?.cpf)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Data de Nascimento</p>
                <p className="text-gray-800">
                  {formatDateOnly(resumoPaciente.dataNascimento)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Sexo</p>
                <p className="text-gray-800">{resumoPaciente?.sexo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Endereço</p>
                <p className="text-gray-800">
                  {resumoPaciente?.enderecoFormatado}
                </p>
              </div>
            </div>
          </div>

          {/* Seção de Consultas */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl text-gray-800">Consultas Realizadas</h2>
            </div>
            <div className="max-h-80 overflow-y-auto overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Medico</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Doença</TableHead>
                    <TableHead>Unidade PSF</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consultas.length > 0 ? (
                    consultas.map((consulta) => {
                        const data = new Date(consulta.dataConsulta);

                        return (
                        <TableRow key={consulta.id}>
                            <TableCell>{consulta.medicoNome}</TableCell>
                            <TableCell>
                            {data.toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell>
                            {data.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            </TableCell>
                            <TableCell>{consulta.doencaNome}</TableCell>
                            <TableCell>{consulta.unidadeNome}</TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={5}
                        className="text-center text-gray-500"
                        >
                        Nenhuma consulta registrada
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </div>

          {/* Seção de Vacinas */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Syringe className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl text-gray-800">Vacinas Tomadas</h2>
            </div>
            <div className="max-h-80 overflow-y-auto overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Vacina</TableHead>
                    <TableHead>Dose</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Enfermeiro</TableHead>
                    <TableHead>Unidade PSF</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vacinas.length > 0 ? (
                    vacinas.map((vacina) => (
                        <TableRow key={vacina.id}>
                        <TableCell>{vacina.nomeVacina}</TableCell>
                        <TableCell>{vacina.dose}</TableCell>
                        <TableCell>
                            {formatDateOnly(vacina.dataAplicacao)}
                        </TableCell>
                        <TableCell>{vacina.nomeEnfermeiro}</TableCell>
                        <TableCell>{vacina.nomeUnidade}</TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={5}
                        className="text-center text-gray-500"
                        >
                        Nenhuma vacina registrada
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </div>

          {/* Seção de Visitas Domiciliares */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl text-gray-800">Visitas Domiciliares</h2>
            </div>
            <div className="max-h-80 overflow-y-auto overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Observações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visitas.length > 0 ? (
                    visitas.map((visita) => {
                        const data = new Date(visita.dataVisita);

                        return (
                        <TableRow key={visita.id}>
                            <TableCell>{visita.nomeAgente}</TableCell>
                            <TableCell>
                            {data.toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell>
                            {data.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            </TableCell>
                            <TableCell>{visita.observacoes ?? "-"}</TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                        >
                        Nenhuma visita domiciliar registrada
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
