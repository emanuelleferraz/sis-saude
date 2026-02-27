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
import { MedicoRequestDTO, MedicoResponseDTO } from "@/types/medico";
import { UnidadeResponseDTO } from "@/types/unidade";
import {
  atualizarMedico,
  criarMedico,
  deletarMedico,
  listarMedicos,
} from "@/services/medicoService";
import { listarUnidades } from "@/services/unidadeService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface MedicosPageProps {
  onBack: () => void;
}

export default function MedicosPage({ onBack }: MedicosPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] =
    useState<MedicoResponseDTO | null>(null);

  const [medicos, setMedicos] = useState<MedicoResponseDTO[]>([]);
  const [unidades, setUnidades] = useState<UnidadeResponseDTO[]>([]);

  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [unidadeId, setUnidadeId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [medicosData, unidadesData] = await Promise.all([
          listarMedicos(),
          listarUnidades(),
        ]);

        setMedicos(medicosData);
        setUnidades(unidadesData);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMedico) {
      setNome(selectedMedico.nome);
      setCrm(selectedMedico.crm);
      setEspecialidade(selectedMedico.especialidade);

      const unidade = unidades.find(
        (u) => u.nome === selectedMedico.nomeUnidade,
      );

      setUnidadeId(unidade?.id || null);
    }
  }, [selectedMedico, unidades]);

  function resetForm() {
    setNome("");
    setCrm("");
    setEspecialidade("");
    setUnidadeId(null);
    setSelectedMedico(null);
  }

  async function handleCreate() {
    if (!unidadeId) return;

    try {
      const novoMedico: MedicoRequestDTO = {
        nome,
        crm,
        especialidade,
        unidadeId,
      };

      await criarMedico(novoMedico);

      const data = await listarMedicos();
      setMedicos(data);

      resetForm();
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Erro ao criar médico", error);
    }
  }

  async function handleUpdate() {
    if (!selectedMedico || !unidadeId) return;

    try {
      const medicoAtualizado: MedicoRequestDTO = {
        nome,
        crm,
        especialidade,
        unidadeId,
      };

      await atualizarMedico(selectedMedico.id, medicoAtualizado);

      const data = await listarMedicos();
      setMedicos(data);

      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar médico", error);
    }
  }

  async function handleDelete() {
    if (!selectedMedico) return;

    try {
      await deletarMedico(selectedMedico.id);

      const data = await listarMedicos();
      setMedicos(data);

      resetForm();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar médico", error);
    }
  }

  const filteredMedicos = medicos.filter(
    (medico) =>
      medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase()),
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
        {menuOpen && <SharedMenu onMenuItemClick={handleMenuClick} />}

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
              <h1 className="text-3xl text-gray-800 mb-6">Médicos</h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar médicos..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsRegisterOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Médico
                </Button>
              </div>
            </div>

            {/* Tabela de médicos */}
            <div className="overflow-x-auto max-h-125 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicos.map((medico) => (
                    <TableRow key={medico.id}>
                      <TableCell>{medico.nome}</TableCell>
                      <TableCell>{medico.crm}</TableCell>
                      <TableCell>{medico.especialidade}</TableCell>
                      <TableCell>{medico.nomeUnidade}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMedico(medico);
                              setIsEditOpen(true);
                            }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMedico(medico);
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
          </div>
        </main>
      </div>

      {/* Modal de Registro */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Registrar Médico</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo médico
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crm">CRM</Label>
              <Input
                id="crm"
                placeholder="CRM 00000-UF"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Input
                id="especialidade"
                placeholder="Digite a especialidade"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={unidadeId ? unidadeId.toString() : ""}
                onValueChange={(value) => setUnidadeId(Number(value))}
              >
                <SelectTrigger className="w-full">
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
            <DialogTitle>Editar Médico</DialogTitle>
            <DialogDescription>Atualize os dados do médico</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome Completo</Label>
              <Input
                id="edit-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-crm">CRM</Label>
              <Input
                id="edit-crm"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-especialidade">Especialidade</Label>
              <Input
                id="edit-especialidade"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={unidadeId ? unidadeId.toString() : ""}
                onValueChange={(value) => setUnidadeId(Number(value))}
              >
                <SelectTrigger className="w-full">
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
              Tem certeza que deseja excluir o médico{" "}
              <strong>{selectedMedico?.nome}</strong>? Esta ação não pode ser
              desfeita.
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
