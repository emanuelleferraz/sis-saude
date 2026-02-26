'use client';
import { Activity, Search, User, Menu, X, Plus, Pencil, Trash2, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SharedMenu } from '@/components/SharedMenu';
import { AplicacaoVacinaResponseDTO } from '@/types/aplicacaoVacina';
import { PacienteResponseDTO } from '@/types/paciente';
import { VacinaResponseDTO } from '@/types/vacina';
import { ProfissionalEnfermagemResponseDTO } from '@/types/profissionalEnfermagem';
import { UnidadeResponseDTO } from '@/types/unidade';
import { atualizarAplicacaoVacina, criarAplicacaoVacina, deletarAplicacaoVacina, listarAplicacoesVacina } from '@/services/aplicacaoVacinaService';
import { getPacientes } from '@/services/pacienteService';
import { listarVacinas } from '@/services/vacinaService';
import { listarProfissionaisEnfermagem } from '@/services/profissionalEnfermagemService';
import { listarUnidades } from '@/services/unidadeService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegistroVacinacaoPageProps {
  onBack: () => void;
}

export default function RegistroVacinacaoPage({ onBack }: RegistroVacinacaoPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState<AplicacaoVacinaResponseDTO | null>(null);

    const [registros, setRegistros] = useState<AplicacaoVacinaResponseDTO[]>([]);

    const [pacientes, setPacientes] = useState<PacienteResponseDTO[]>([]);
    const [vacinas, setVacinas] = useState<VacinaResponseDTO[]>([]);
    const [enfermeiros, setEnfermeiros] = useState<ProfissionalEnfermagemResponseDTO[]>([]);
    const [unidades, setUnidades] = useState<UnidadeResponseDTO[]>([]);

    const [pacienteId, setPacienteId] = useState<number | null>(null);
    const [vacinaId, setVacinaId] = useState<number | null>(null);
    const [enfermeiroId, setEnfermeiroId] = useState<number | null>(null);
    const [unidadeId, setUnidadeId] = useState<number | null>(null);

    const [data, setData] = useState("");
    const [dose, setDose] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      carregarDados();
    }, []);

    async function carregarDados() {
      try {
        const [
          registrosData,
          pacientesData,
          vacinasData,
          enfermeirosData,
          unidadesData,
        ] = await Promise.all([
          listarAplicacoesVacina(),
          getPacientes(),
          listarVacinas(),
          listarProfissionaisEnfermagem(),
          listarUnidades(),
        ]);

        setRegistros(registrosData);
        setPacientes(pacientesData);
        setVacinas(vacinasData);
        setEnfermeiros(enfermeirosData);
        setUnidades(unidadesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    useEffect(() => {
      if (selectedRegistro) {
        const dateObj = new Date(selectedRegistro.dataAplicacao);
        const dataFormatada = dateObj.toISOString().split("T")[0];

        setData(dataFormatada);
        setDose(selectedRegistro.dose);

        const paciente = pacientes.find(
          (p) => p.nome === selectedRegistro.nomePaciente,
        );

        const vacina = vacinas.find(
          (v) => v.nome === selectedRegistro.nomeVacina,
        );

        const enfermeiro = enfermeiros.find(
          (e) => e.nome === selectedRegistro.nomeEnfermeiro,
        );

        const unidade = unidades.find(
          (u) => u.nome === selectedRegistro.nomeUnidade,
        );

        setPacienteId(paciente?.id || null);
        setVacinaId(vacina?.id || null);
        setEnfermeiroId(enfermeiro?.id || null);
        setUnidadeId(unidade?.id || null);
      }
    }, [selectedRegistro, pacientes, vacinas, enfermeiros, unidades]);

    function resetForm() {
      setPacienteId(null);
      setVacinaId(null);
      setEnfermeiroId(null);
      setUnidadeId(null);
      setData("");
      setDose("");
      setSelectedRegistro(null);
    }

    const filteredRegistros = registros.filter(
        (r) =>
            r.nomePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.nomeVacina.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.nomeEnfermeiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleCreate() {
      if (!pacienteId || !vacinaId || !enfermeiroId || !unidadeId || !data)
        return;

      try {
        await criarAplicacaoVacina({
          pacienteId,
          vacinaId,
          enfermeiroId,
          unidadeId,
          dose,
          dataAplicacao: data, // apenas data
        });

        await carregarDados();
        resetForm();
        setIsRegisterOpen(false);
      } catch (error) {
        console.error("Erro ao criar aplicação:", error);
      }
    }

    async function handleUpdate() {
      if (
        !selectedRegistro ||
        !pacienteId ||
        !vacinaId ||
        !enfermeiroId ||
        !unidadeId ||
        !data
      )
        return;

      try {
        await atualizarAplicacaoVacina(selectedRegistro.id, {
          pacienteId,
          vacinaId,
          enfermeiroId,
          unidadeId,
          dose,
          dataAplicacao: data, // apenas data
        });

        await carregarDados();
        resetForm();
        setIsEditOpen(false);
      } catch (error) {
        console.error("Erro ao atualizar aplicação:", error);
      }
    }

    async function handleDelete() {
      if (!selectedRegistro) return;

      try {
        await deletarAplicacaoVacina(selectedRegistro.id);
        await carregarDados();
        setIsDeleteOpen(false);
        resetForm();
      } catch (error) {
        console.error("Erro ao deletar aplicação:", error);
      }
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
        {/* Menu lateral */}
        {menuOpen && (
          <SharedMenu
            onMenuItemClick={(key) => {
              if (key === "sobre") {
                onBack();
              }
            }}
          />
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          {/* Botão Página Inicial */}
          <Button
            onClick={onBack}
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
                Registro de Vacinação
              </h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar registros de vacinação..."
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
                  Registrar Vacinação
                </Button>
              </div>
            </div>

            {/* Tabela de registros */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Paciente</TableHead>
                  <TableHead>Nome da Vacina</TableHead>
                  <TableHead>Data da Aplicação</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Enfermeiro</TableHead>
                  <TableHead>Unidade PSF</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{registro.nomePaciente}</TableCell>
                    <TableCell>{registro.nomeVacina}</TableCell>
                    <TableCell>{formatDateOnly(registro.dataAplicacao)}</TableCell>
                    <TableCell>{registro.dose}</TableCell>
                    <TableCell>{registro.nomeEnfermeiro}</TableCell>
                    <TableCell>{registro.nomeUnidade}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRegistro(registro);
                            setIsEditOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRegistro(registro);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Modal de Registro */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Registrar Vacinação</DialogTitle>
            <DialogDescription>
              Preencha os dados da vacinação do paciente
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

            {/* Select Vacina */}
            <div className="grid gap-2">
              <Label>Vacina</Label>
              <Select
                value={vacinaId?.toString() || ""}
                onValueChange={(value) => setVacinaId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a vacina" />
                </SelectTrigger>
                <SelectContent>
                  {vacinas.map((vacina) => (
                    <SelectItem key={vacina.id} value={vacina.id.toString()}>
                      {vacina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Input Data da Aplicação */}
            <div className="grid gap-2">
              <Label htmlFor="dataAplicacao">Data da Aplicação</Label>
              <Input
                id="dataAplicacao"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* Input Dose */}
            <div className="grid gap-2">
              <Label htmlFor="dose">Dose</Label>
              <Input
                id="dose"
                placeholder="Ex: 1ª Dose, 2ª Dose, Reforço"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
              />
            </div>

            {/* Select Enfermeiro */}
            <div className="grid gap-2">
              <Label>Enfermeiro/Técnico</Label>
              <Select
                value={enfermeiroId?.toString() || ""}
                onValueChange={(value) => setEnfermeiroId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o enfermeiro" />
                </SelectTrigger>
                <SelectContent>
                  {enfermeiros.map((enfermeiro) => (
                    <SelectItem
                      key={enfermeiro.id}
                      value={enfermeiro.id.toString()}
                    >
                      {enfermeiro.nome}
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
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Editar Registro de Vacinação</DialogTitle>
            <DialogDescription>
              Atualize os dados da vacinação
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

            {/* Select Vacina */}
            <div className="grid gap-2">
              <Label>Vacina</Label>
              <Select
                value={vacinaId?.toString() || ""}
                onValueChange={(value) => setVacinaId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a vacina" />
                </SelectTrigger>
                <SelectContent>
                  {vacinas.map((vacina) => (
                    <SelectItem key={vacina.id} value={vacina.id.toString()}>
                      {vacina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Input Data da Aplicação */}
            <div className="grid gap-2">
              <Label htmlFor="edit-dataAplicacao">Data da Aplicação</Label>
              <Input
                id="edit-dataAplicacao"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* Input Dose */}
            <div className="grid gap-2">
              <Label htmlFor="edit-dose">Dose</Label>
              <Input
                id="edit-dose"
                placeholder="Ex: 1ª Dose, 2ª Dose, Reforço"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
              />
            </div>

            {/* Select Enfermeiro */}
            <div className="grid gap-2">
              <Label>Enfermeiro/Técnico</Label>
              <Select
                value={enfermeiroId?.toString() || ""}
                onValueChange={(value) => setEnfermeiroId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o enfermeiro" />
                </SelectTrigger>
                <SelectContent>
                  {enfermeiros.map((enfermeiro) => (
                    <SelectItem
                      key={enfermeiro.id}
                      value={enfermeiro.id.toString()}
                    >
                      {enfermeiro.nome}
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
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id.toString()}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Tem certeza que deseja excluir o registro de vacinação de{" "}
              <strong>{selectedRegistro?.nomePaciente}</strong>? Esta ação não
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