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
import { ConsultaRequestDTO, ConsultaResponseDTO } from "@/types/consulta";
import {
  atualizarConsulta,
  criarConsulta,
  deletarConsulta,
  listarConsultas,
} from "@/services/consultaService";
import { getPacientes } from "@/services/pacienteService";
import { listarUnidades } from "@/services/unidadeService";
import { listarDoencas } from "@/services/doencaService";
import { listarMedicos } from "@/services/medicoService";
import { useRouter } from "next/navigation";

interface ConsultasPageProps {
  onBack: () => void;
}

export default function ConsultasPage({ onBack }: ConsultasPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConsulta, setSelectedConsulta] =
    useState<ConsultaResponseDTO | null>(null);

  const [consultas, setConsultas] = useState<ConsultaResponseDTO[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [unidadesPSF, setUnidadesPSF] = useState<any[]>([]);
  const [doencas, setDoencas] = useState<any[]>([]);

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [unidadeId, setUnidadeId] = useState<number | null>(null);
  const [doencaId, setDoencaId] = useState<number | null>(null);
  const [dataConsulta, setDataConsulta] = useState("");
  const [horaConsulta, setHoraConsulta] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [
        consultasData,
        pacientesData,
        medicosData,
        unidadesData,
        doencasData,
      ] = await Promise.all([
        listarConsultas(),
        getPacientes(),
        listarMedicos(),
        listarUnidades(),
        listarDoencas(),
      ]);

      setConsultas(consultasData);
      setPacientes(pacientesData);
      setMedicos(medicosData);
      setUnidadesPSF(unidadesData);
      setDoencas(doencasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  const filteredConsultas = consultas.filter(
    (c) =>
      c.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.medicoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unidadeNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.doencaNome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function resetForm() {
    setPacienteId(null);
    setMedicoId(null);
    setUnidadeId(null);
    setDoencaId(null);
    setDataConsulta("");
    setHoraConsulta("");
    setObservacoes("");
    setSelectedConsulta(null);
  }

  useEffect(() => {
    if (selectedConsulta) {
      // Formatar data e hora
      const dateObj = new Date(selectedConsulta.dataConsulta);
      const dataFormatada = dateObj.toISOString().split("T")[0];
      const horaFormatada =
        dateObj.toISOString().split("T")[1]?.substring(0, 5) || "";

      setDataConsulta(dataFormatada);
      setHoraConsulta(horaFormatada);
      setObservacoes(selectedConsulta.observacoes || "");

      const paciente = pacientes.find(
        (p) => p.nome === selectedConsulta.pacienteNome,
      );
      const medico = medicos.find(
        (m) => m.nome === selectedConsulta.medicoNome,
      );
      const doenca = doencas.find(
        (d) => d.nome === selectedConsulta.doencaNome,
      );
      const unidade = unidadesPSF.find(
        (u) => u.nome === selectedConsulta.unidadeNome,
      );

      setPacienteId(paciente?.id || null);
      setMedicoId(medico?.id || null);
      setDoencaId(doenca?.id || null);
      setUnidadeId(unidade?.id || null);
    }
  }, [selectedConsulta, pacientes, medicos, doencas, unidadesPSF]);

  async function handleCreate() {
    if (
      !pacienteId ||
      !medicoId ||
      !unidadeId ||
      !doencaId ||
      !dataConsulta ||
      !horaConsulta
    )
      return;

    try {
      await criarConsulta({
        pacienteId,
        medicoId: medicoId,
        unidadeId,
        doencaId,
        dataConsulta: `${dataConsulta}T${horaConsulta}:00`,
        observacoes,
      } as ConsultaRequestDTO);

      await carregarDados();
      resetForm();
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
    }
  }

  async function handleUpdate() {
    if (
      !selectedConsulta ||
      !pacienteId ||
      !medicoId ||
      !unidadeId ||
      !doencaId ||
      !dataConsulta ||
      !horaConsulta
    )
      return;

    try {
      await atualizarConsulta(selectedConsulta.id, {
        pacienteId,
        medicoId: medicoId,
        unidadeId,
        doencaId,
        dataConsulta: `${dataConsulta}T${horaConsulta}:00`,
        observacoes,
      } as ConsultaRequestDTO);

      await carregarDados();
      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
    }
  }

  async function handleDelete() {
    if (!selectedConsulta) return;

    try {
      await deletarConsulta(selectedConsulta.id);
      await carregarDados();
      resetForm();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
    }
  }

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
              <h1 className="text-3xl text-gray-800 mb-6">Consultas</h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar consultas..."
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
                  Registrar Consulta
                </Button>
              </div>
            </div>

            {/* Tabela de consultas */}
            <div className="overflow-x-auto max-h-125 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Doença</TableHead>
                    <TableHead>Unidade PSF</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultas.map((consulta) => {
                    const dateObj = new Date(consulta.dataConsulta);

                    const dataFormatada = dateObj.toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    });
                    const horarioFormatado = dateObj.toTimeString().slice(0, 5);
                    return (
                      <TableRow key={consulta.id}>
                        <TableCell>{consulta.pacienteNome}</TableCell>
                        <TableCell>{consulta.medicoNome}</TableCell>
                        <TableCell>{dataFormatada}</TableCell>
                        <TableCell>{horarioFormatado}</TableCell>
                        <TableCell>{consulta.doencaNome}</TableCell>
                        <TableCell>{consulta.unidadeNome}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedConsulta(consulta);
                                setIsEditOpen(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedConsulta(consulta);
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
            <DialogTitle>Registrar Consulta</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova consulta
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Select Paciente */}
            <div className="grid gap-2">
              <Label>Paciente</Label>
              <Select
                value={pacienteId?.toString() || ""}
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

            {/* Select Profissional */}
            <div className="grid gap-2">
              <Label>Profissional</Label>
              <Select
                value={medicoId?.toString() || ""}
                onValueChange={(value) => setMedicoId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico.id} value={medico.id.toString()}>
                      {medico.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            {/* Hora */}
            <div className="grid gap-2">
              <Label>Horário</Label>
              <Input
                type="time"
                value={horaConsulta}
                onChange={(e) => setHoraConsulta(e.target.value)}
              />
            </div>

            {/* Select Doença */}
            <div className="grid gap-2">
              <Label>Doença</Label>
              <Select
                value={doencaId?.toString() || ""}
                onValueChange={(value) => setDoencaId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a doença" />
                </SelectTrigger>
                <SelectContent>
                  {doencas.map((doenca) => (
                    <SelectItem key={doenca.id} value={doenca.id.toString()}>
                      {doenca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Unidade */}
            <div className="grid gap-2">
              <Label>Unidade PSF</Label>
              <Select
                value={unidadeId?.toString() || ""}
                onValueChange={(value) => setUnidadeId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesPSF.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div className="grid gap-2">
              <Label>Observações</Label>
              <Input
                type="text"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações (opcional)"
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
            <DialogTitle>Editar Consulta</DialogTitle>
            <DialogDescription>Atualize os dados da consulta</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Select Paciente */}
            <div className="grid gap-2">
              <Label>Paciente</Label>
              <Select
                value={pacienteId?.toString() || ""}
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

            {/* Select Profissional */}
            <div className="grid gap-2">
              <Label>Profissional</Label>
              <Select
                value={medicoId?.toString() || ""}
                onValueChange={(value) => setMedicoId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico.id} value={medico.id.toString()}>
                      {medico.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            {/* Hora */}
            <div className="grid gap-2">
              <Label>Horário</Label>
              <Input
                type="time"
                value={horaConsulta}
                onChange={(e) => setHoraConsulta(e.target.value)}
              />
            </div>

            {/* Select Doença */}
            <div className="grid gap-2">
              <Label>Doença</Label>
              <Select
                value={doencaId?.toString() || ""}
                onValueChange={(value) => setDoencaId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a doença" />
                </SelectTrigger>
                <SelectContent>
                  {doencas.map((doenca) => (
                    <SelectItem key={doenca.id} value={doenca.id.toString()}>
                      {doenca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Unidade */}
            <div className="grid gap-2">
              <Label>Unidade PSF</Label>
              <Select
                value={unidadeId?.toString() || ""}
                onValueChange={(value) => setUnidadeId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesPSF.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div className="grid gap-2">
              <Label>Observações</Label>
              <Input
                type="text"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações (opcional)"
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
              Tem certeza que deseja excluir a consulta do paciente{" "}
              <strong>{selectedConsulta?.pacienteNome}</strong>? Esta ação não
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
