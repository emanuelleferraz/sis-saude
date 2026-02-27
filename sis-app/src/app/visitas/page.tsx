"use client";
import {
  Activity,
  Search,
  User,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Home,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SharedMenu } from "@/components/SharedMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisitaResponseDTO } from "@/types/visita";
import { PacienteResponseDTO } from "@/types/paciente";
import { AgenteSaudeResponseDTO } from "@/types/agente";
import {
  atualizarVisita,
  criarVisita,
  deletarVisita,
  listarVisitas,
} from "@/services/visitaService";
import { getPacientes } from "@/services/pacienteService";
import { listarAgentesSaude } from "@/services/agenteService";
import { useRouter } from "next/navigation";

interface VisitasDomiciliaresPageProps {
  onBack: () => void;
}

export default function VisitasDomiciliaresPage({
  onBack,
}: VisitasDomiciliaresPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVisita, setSelectedVisita] =
    useState<VisitaResponseDTO | null>(null);

  const [visitas, setVisitas] = useState<VisitaResponseDTO[]>([]);
  const [pacientes, setPacientes] = useState<PacienteResponseDTO[]>([]);
  const [agentes, setAgentes] = useState<AgenteSaudeResponseDTO[]>([]);

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [agenteId, setAgenteId] = useState<number | null>(null);

  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [visitasData, pacientesData, agentesData] = await Promise.all([
        listarVisitas(),
        getPacientes(),
        listarAgentesSaude(),
      ]);

      setVisitas(visitasData);
      setPacientes(pacientesData);
      setAgentes(agentesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  useEffect(() => {
    if (selectedVisita) {
      const dateObj = new Date(selectedVisita.dataVisita);

      const dataFormatada = dateObj.toISOString().split("T")[0];
      const horaFormatada = dateObj.toTimeString().slice(0, 5);

      setData(dataFormatada);
      setHorario(horaFormatada);
      setObservacoes(selectedVisita.observacoes);

      const paciente = pacientes.find(
        (p) => p.nome === selectedVisita.nomePaciente,
      );

      const agente = agentes.find((a) => a.nome === selectedVisita.nomeAgente);

      setPacienteId(paciente?.id || null);
      setAgenteId(agente?.id || null);
    }
  }, [selectedVisita, pacientes, agentes]);

  function resetForm() {
    setPacienteId(null);
    setAgenteId(null);
    setData("");
    setHorario("");
    setObservacoes("");
    setSelectedVisita(null);
  }

  async function handleCreate() {
    if (!pacienteId || !agenteId || !data || !horario) return;

    try {
      const dataHora = `${data}T${horario}:00`;

      await criarVisita({
        pacienteId,
        agenteId,
        observacoes,
        dataVisita: dataHora,
      });

      await carregarDados();
      resetForm();
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Erro ao criar visita:", error);
    }
  }

  async function handleUpdate() {
    if (!selectedVisita || !pacienteId || !agenteId) return;

    try {
      const dataHora = `${data}T${horario}:00`;

      await atualizarVisita(selectedVisita.id, {
        pacienteId,
        agenteId,
        observacoes,
        dataVisita: dataHora,
      });

      await carregarDados();
      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar visita:", error);
    }
  }

  async function handleDelete() {
    if (!selectedVisita) return;

    try {
      await deletarVisita(selectedVisita.id);
      await carregarDados();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar visita:", error);
    }
  }

  const filteredVisitas = visitas.filter(
    (v) =>
      v.nomePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nomeAgente.toLowerCase().includes(searchTerm.toLowerCase()),
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
            onMenuItemClick={handleMenuClick}
          />
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          {/* Botão Página Inicial */}
          <Button
            onClick={() => router.push("/home")}
            variant="ghost"
            className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Página Inicial
          </Button>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Cabeçalho da página */}
            <div className="mb-6">
              <h1 className="text-3xl text-gray-800 mb-6">
                Visitas Domiciliares
              </h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar visitas..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {resetForm(); setIsRegisterOpen(true);}}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Visita
                </Button>
              </div>
            </div>

            {/* Tabela de visitas */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitas.map((visita) => {
                    const dateObj = new Date(visita.dataVisita);

                    const dataFormatada = dateObj.toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    });
                    const horarioFormatado = dateObj.toTimeString().slice(0, 5);

                    return (
                      <TableRow key={visita.id}>
                        <TableCell>{visita.nomePaciente}</TableCell>
                        <TableCell>{visita.nomeAgente}</TableCell>
                        <TableCell>{dataFormatada}</TableCell>
                        <TableCell>{horarioFormatado}</TableCell>
                        <TableCell>{visita.observacoes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedVisita(visita);
                                setIsEditOpen(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVisita(visita);
                                setIsDeleteOpen(true);
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Registro */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Registrar Visita Domiciliar</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova visita
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Paciente */}
            <div className="grid gap-2">
              <Label>Paciente</Label>
              <Select
                value={pacienteId?.toString()}
                onValueChange={(value) => setPacienteId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem
                      key={paciente.id}
                      value={paciente.id.toString()}
                    >
                      {paciente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Agente */}
            <div className="grid gap-2">
              <Label>Agente de Saúde</Label>
              <Select
                value={agenteId?.toString()}
                onValueChange={(value) => setAgenteId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o agente" />
                </SelectTrigger>
                <SelectContent>
                  {agentes.map((agente) => (
                    <SelectItem key={agente.id} value={agente.id.toString()}>
                      {agente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* Horário */}
            <div className="grid gap-2">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>

            {/* Observações */}
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                placeholder="Digite observações da visita"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Editar Visita Domiciliar</DialogTitle>
            <DialogDescription>Atualize os dados da visita</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Paciente */}
            <div className="grid gap-2">
              <Label>Paciente</Label>
              <Select
                value={pacienteId?.toString()}
                onValueChange={(value) => setPacienteId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem
                      key={paciente.id}
                      value={paciente.id.toString()}
                    >
                      {paciente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Agente */}
            <div className="grid gap-2">
              <Label>Agente de Saúde</Label>
              <Select
                value={agenteId?.toString()}
                onValueChange={(value) => setAgenteId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o agente" />
                </SelectTrigger>
                <SelectContent>
                  {agentes.map((agente) => (
                    <SelectItem key={agente.id} value={agente.id.toString()}>
                      {agente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="grid gap-2">
              <Label htmlFor="edit-data">Data</Label>
              <Input
                id="edit-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* Horário */}
            <div className="grid gap-2">
              <Label htmlFor="edit-horario">Horário</Label>
              <Input
                id="edit-horario"
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>

            {/* Observações */}
            <div className="grid gap-2">
              <Label htmlFor="edit-observacoes">Observações</Label>
              <Input
                id="edit-observacoes"
                placeholder="Digite observações da visita"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdate}
            >
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a visita do paciente{" "}
              <strong>{selectedVisita?.nomePaciente}</strong>? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
