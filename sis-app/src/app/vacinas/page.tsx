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
import { VacinaRequestDTO, VacinaResponseDTO } from "@/types/vacina";
import {
  atualizarVacina,
  criarVacina,
  deletarVacina,
  listarVacinas,
} from "@/services/vacinaService";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

interface VacinasPageProps {
  onBack: () => void;
}

export default function VacinasPage({ onBack }: VacinasPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVacina, setSelectedVacina] =
    useState<VacinaResponseDTO | null>(null);

  const [vacinas, setVacinas] = useState<VacinaResponseDTO[]>([]);
  const [nome, setNome] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [dosagem, setDosagem] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchVacinas() {
      try {
        const data = await listarVacinas();
        setVacinas(data);
      } catch (error) {
        console.error("Erro ao listar vacinas", error);
      }
    }
    fetchVacinas();
  }, []);

  useEffect(() => {
    if (selectedVacina) {
      setNome(selectedVacina.nome);
      setFabricante(selectedVacina.fabricante);
      setDosagem(selectedVacina.dosagem);
    }
  }, [selectedVacina]);

  function resetForm() {
    setNome("");
    setFabricante("");
    setDosagem("");
    setSelectedVacina(null);
  }

  async function handleCreate() {
    try {
      const novaVacina: VacinaRequestDTO = {
        nome,
        fabricante,
        dosagem,
      };

      await criarVacina(novaVacina);

      const data = await listarVacinas();
      setVacinas(data);

      resetForm();
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Erro ao criar vacina", error);
    }
  }

  async function handleUpdate() {
    if (!selectedVacina) return;

    try {
      const vacinaAtualizada: VacinaRequestDTO = {
        nome,
        fabricante,
        dosagem,
      };

      await atualizarVacina(selectedVacina.id, vacinaAtualizada);

      const data = await listarVacinas();
      setVacinas(data);

      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar vacina", error);
    }
  }

  async function handleDelete() {
    if (!selectedVacina) return;

    try {
      await deletarVacina(selectedVacina.id);

      const data = await listarVacinas();
      setVacinas(data);

      resetForm();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar vacina", error);
    }
  }

  const filteredVacinas = vacinas.filter(
    (vacina) =>
      vacina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacina.fabricante.toLowerCase().includes(searchTerm.toLowerCase()),
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
              {/* Cabeçalho da página */}
              <div className="mb-6">
                <h1 className="text-3xl text-gray-800 mb-6">Vacinas</h1>

                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Pesquisar vacinas..."
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
                    Adicionar Vacina
                  </Button>
                </div>
              </div>

              {/* Tabela de vacinas */}
              <div className="overflow-x-auto max-h-125 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Fabricante</TableHead>
                      <TableHead>Dosagem</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVacinas.map((vacina) => (
                      <TableRow key={vacina.id}>
                        <TableCell>{vacina.nome}</TableCell>
                        <TableCell>{vacina.fabricante}</TableCell>
                        <TableCell>{vacina.dosagem}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedVacina(vacina);
                                setIsEditOpen(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVacina(vacina);
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
              <DialogTitle>Adicionar Vacina</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova vacina
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome da vacina"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fabricante">Fabricante</Label>
                <Input
                  id="fabricante"
                  placeholder="Digite o fabricante da vacina"
                  value={fabricante}
                  onChange={(e) => setFabricante(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosagem">Dosagem</Label>
                <Input
                  id="dosagem"
                  placeholder="Digite a dosagem da vacina"
                  value={dosagem}
                  onChange={(e) => setDosagem(e.target.value)}
                />
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

        {/* Modal de Edição */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Editar Vacina</DialogTitle>
              <DialogDescription>Atualize os dados da vacina</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nome">Nome</Label>
                <Input
                  id="edit-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fabricante">Fabricante</Label>
                <Input
                  id="edit-fabricante"
                  value={fabricante}
                  onChange={(e) => setFabricante(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dosagem">Dosagem</Label>
                <Input
                  id="edit-dosagem"
                  value={dosagem}
                  onChange={(e) => setDosagem(e.target.value)}
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
                Tem certeza que deseja excluir a vacina{" "}
                <strong>{selectedVacina?.nome}</strong>? Esta ação não pode ser
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
    </AuthGuard>
  );
}
