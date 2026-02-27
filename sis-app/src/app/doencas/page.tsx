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
  DoencaRequestDTO,
  DoencaResponseDTO,
  TipoDoenca,
} from "@/types/doenca";
import {
  listarDoencas,
  criarDoenca,
  atualizarDoenca,
  deletarDoenca,
} from "@/services/doencaService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface DoencasPageProps {
  onBack: () => void;
}

export default function DoencasPage({ onBack }: DoencasPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoenca, setSelectedDoenca] =
    useState<DoencaResponseDTO | null>(null);

  const [doencas, setDoencas] = useState<DoencaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoencas = doencas.filter(
    (doenca) =>
      doenca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doenca.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoDoenca>("TRANSMISSIVEL");
  const [classificacao, setClassificacao] = useState("");

  const tipoLabel: Record<TipoDoenca, string> = {
    CRONICA: "Crônica",
    TRANSMISSIVEL: "Transmissível",
  };
  const router = useRouter();

  useEffect(() => {
    carregarDoencas();
  }, []);

  async function carregarDoencas() {
    try {
      setLoading(true);
      const data = await listarDoencas();
      setDoencas(data);
    } catch (err) {
      console.error("Erro ao carregar doenças:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedDoenca) {
      setNome(selectedDoenca.nome);
      setTipo(selectedDoenca.tipo);
      setClassificacao(selectedDoenca.classificacao);
    }
  }, [selectedDoenca]);

  function resetForm() {
    setNome("");
    setTipo("TRANSMISSIVEL");
    setClassificacao("");
    setSelectedDoenca(null);
  }

  async function handleCreate() {
    try {
      const novaDoenca: DoencaRequestDTO = {
        nome,
        tipo,
        classificacao,
      };

      await criarDoenca(novaDoenca);
      await carregarDoencas();

      setIsRegisterOpen(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao criar doença:", err);
    }
  }

  async function handleUpdate() {
    if (!selectedDoenca) return;

    try {
      const doencaAtualizada: DoencaRequestDTO = {
        nome,
        tipo,
        classificacao,
      };

      await atualizarDoenca(selectedDoenca.id, doencaAtualizada);
      await carregarDoencas();

      setIsEditOpen(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao atualizar doença:", err);
    }
  }

  async function handleDelete() {
    if (!selectedDoenca) return;

    try {
      await deletarDoenca(selectedDoenca.id);
      await carregarDoencas();

      setIsDeleteOpen(false);
      setSelectedDoenca(null);
    } catch (err) {
      console.error("Erro ao excluir doença:", err);
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
              <h1 className="text-3xl text-gray-800 mb-6">Doenças</h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar doenças..."
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
                  Adicionar Doença
                </Button>
              </div>
            </div>

            {/* Tabela de doenças */}
            <div className="overflow-x-auto max-h-125 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoencas.map((doenca) => (
                    <TableRow key={doenca.id}>
                      <TableCell>{doenca.nome}</TableCell>
                      <TableCell>{tipoLabel[doenca.tipo]}</TableCell>
                      <TableCell>{doenca.classificacao}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedDoenca(doenca);
                              setIsEditOpen(true);
                            }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoenca(doenca);
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
            <DialogTitle>Adicionar Doença</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova doença
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Doença</Label>
              <Input
                id="nome"
                placeholder="Digite o nome da doença"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(e) => setTipo(e as TipoDoenca)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRONICA">Crônica</SelectItem>
                  <SelectItem value="TRANSMISSIVEL">Transmissível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="classificacao">Classificação</Label>
              <Input
                id="classificacao"
                placeholder="Ex: Cardiovascular, Metabólica"
                value={classificacao}
                onChange={(e) => setClassificacao(e.target.value)}
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
            <DialogTitle>Editar Doença</DialogTitle>
            <DialogDescription>Atualize os dados da doença</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome da Doença</Label>
              <Input
                id="edit-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(e) => setTipo(e as TipoDoenca)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRONICA">Crônica</SelectItem>
                  <SelectItem value="TRANSMISSIVEL">Transmissível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-classificacao">Classificação</Label>
              <Input
                id="edit-classificacao"
                value={classificacao}
                onChange={(e) => setClassificacao(e.target.value)}
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
              Tem certeza que deseja excluir a doença{" "}
              <strong>{selectedDoenca?.nome}</strong>? Esta ação não pode ser
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
