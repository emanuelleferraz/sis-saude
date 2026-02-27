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
  EnumTypeEnfermagem,
  ProfissionalEnfermagemRequestDTO,
  ProfissionalEnfermagemResponseDTO,
} from "@/types/profissionalEnfermagem";
import { UnidadeResponseDTO } from "@/types/unidade";
import { listarUnidades } from "@/services/unidadeService";
import {
  atualizarProfissionalEnfermagem,
  criarProfissionalEnfermagem,
  deletarProfissionalEnfermagem,
  listarProfissionaisEnfermagem,
} from "@/services/profissionalEnfermagemService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

interface EnfermeirosPageProps {
  onBack: () => void;
}

export default function EnfermeirosPage({ onBack }: EnfermeirosPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEnfermeiro, setSelectedEnfermeiro] =
    useState<ProfissionalEnfermagemResponseDTO | null>(null);

  const [enfermeiros, setEnfermeiros] = useState<
    ProfissionalEnfermagemResponseDTO[]
  >([]);
  const [unidades, setUnidades] = useState<UnidadeResponseDTO[]>([]);

  const [nome, setNome] = useState("");
  const [coren, setCoren] = useState("");
  const [telefone, setTelefone] = useState("");
  const [unidadeId, setUnidadeId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<EnumTypeEnfermagem | "">("");

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const tipoLabel: Record<EnumTypeEnfermagem, string> = {
    Enfermeiro: "Enfermeiro(a)",
    Tecnico_Enfermagem: "Técnico em Enfermagem",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [enfData, unidData] = await Promise.all([
          listarProfissionaisEnfermagem(),
          listarUnidades(),
        ]);

        setEnfermeiros(enfData);
        setUnidades(unidData);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEnfermeiro) {
      setNome(selectedEnfermeiro.nome);
      setCoren(selectedEnfermeiro.coren);
      setTelefone(selectedEnfermeiro.telefone);
      setUnidadeId(selectedEnfermeiro.unidadeId);
      setTipo(selectedEnfermeiro.tipo);
    }
  }, [selectedEnfermeiro]);

  function resetForm() {
    setNome("");
    setCoren("");
    setTelefone("");
    setUnidadeId(null);
    setTipo("");
    setSelectedEnfermeiro(null);
  }

  const formatTelefone = (value: string) => {
    let num = value.replace(/\D/g, "");
    num = num.substring(0, 11);

    if (num.length <= 10) {
      return num
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return num
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  async function handleCreate() {
    if (!unidadeId || !tipo) return;

    try {
      const novo: ProfissionalEnfermagemRequestDTO = {
        nome,
        coren,
        telefone,
        unidadeId,
        tipo,
      };

      await criarProfissionalEnfermagem(novo);

      const data = await listarProfissionaisEnfermagem();
      setEnfermeiros(data);

      resetForm();
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Erro ao criar profissional", error);
    }
  }

  async function handleUpdate() {
    if (!selectedEnfermeiro || !unidadeId || !tipo) return;

    try {
      const atualizado: ProfissionalEnfermagemRequestDTO = {
        nome,
        coren,
        telefone,
        unidadeId,
        tipo,
      };

      await atualizarProfissionalEnfermagem(selectedEnfermeiro.id, atualizado);

      const data = await listarProfissionaisEnfermagem();
      setEnfermeiros(data);

      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar profissional", error);
    }
  }

  async function handleDelete() {
    if (!selectedEnfermeiro) return;

    try {
      await deletarProfissionalEnfermagem(selectedEnfermeiro.id);

      const data = await listarProfissionaisEnfermagem();
      setEnfermeiros(data);

      resetForm();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar profissional", error);
    }
  }

  const filteredEnfermeiros = enfermeiros.filter(
    (enf) =>
      enf.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enf.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enf.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleMenuClick(key: string) {
    router.push(`/${key}`);
  }

  return (
    <AuthGuard>
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
              <div className="mb-6">
                <h1 className="text-3xl text-gray-800 mb-6">
                  Enfermeiros / Técnicos de Enfermagem
                </h1>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Pesquisar enfermeiros..."
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
                    Registrar Profissional
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-125 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>COREN</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnfermeiros.map((enfermeiro) => (
                      <TableRow key={enfermeiro.id}>
                        <TableCell>{enfermeiro.nome}</TableCell>
                        <TableCell>{enfermeiro.coren}</TableCell>
                        <TableCell>{tipoLabel[enfermeiro.tipo]}</TableCell>
                        <TableCell>{enfermeiro.nomeUnidade}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedEnfermeiro(enfermeiro);
                                setIsEditOpen(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEnfermeiro(enfermeiro);
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
        {/* MODAL DE CREATE*/}
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Registrar Enfermeiro</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo enfermeiro
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
                <Label htmlFor="coren">COREN</Label>
                <Input
                  id="coren"
                  placeholder="COREN 000000-UF"
                  value={coren}
                  onChange={(e) => setCoren(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select
                  value={tipo}
                  onValueChange={(value) =>
                    setTipo(value as EnumTypeEnfermagem)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enfermeiro">Enfermeiro</SelectItem>
                    <SelectItem value="Tecnico_Enfermagem">
                      Técnico de Enfermagem
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                      <SelectItem
                        key={unidade.id}
                        value={unidade.id.toString()}
                      >
                        {unidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRegisterOpen(false)}
              >
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
        {/* MODAL DE UPDATE*/}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Editar Enfermeiro</DialogTitle>
              <DialogDescription>
                Atualize os dados do enfermeiro
              </DialogDescription>
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
                <Label htmlFor="edit-coren">COREN</Label>
                <Input
                  id="edit-coren"
                  value={coren}
                  onChange={(e) => setCoren(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select
                  value={tipo}
                  onValueChange={(value) =>
                    setTipo(value as EnumTypeEnfermagem)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enfermeiro">Enfermeiro</SelectItem>
                    <SelectItem value="Tecnico_Enfermagem">
                      Técnico de Enfermagem
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                      <SelectItem
                        key={unidade.id}
                        value={unidade.id.toString()}
                      >
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

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-100">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o enfermeiro{" "}
                <strong>{selectedEnfermeiro?.nome}</strong>? Esta ação não pode
                ser desfeita.
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
    </AuthGuard>
  );
}
