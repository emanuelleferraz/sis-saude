"use client";

import {
  listarBairros,
  criarBairro,
  atualizarBairro,
  deletarBairro,
} from "@/services/bairroService";
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
import { Bairro } from "@/types/bairro";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

interface BairrosPageProps {
  onBack: () => void;
}

export default function BairrosPage({ onBack }: BairrosPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBairro, setSelectedBairro] = useState<any>(null);

  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const data = await listarBairros();
        setBairros(data);
      } catch (err) {
        console.error("Erro ao carregar bairros:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBairros();
  }, []);

  const handleCreateBairro = async () => {
    const nomeInput = (document.getElementById("nome") as HTMLInputElement)
      .value;
    if (!nomeInput) return;

    try {
      const novoBairro = await criarBairro({ nome: nomeInput });
      setBairros((prev) => [...prev, novoBairro]);
      setIsRegisterOpen(false);
    } catch (err) {
      console.error("Erro ao criar bairro:", err);
    }
  };

  const handleUpdateBairro = async () => {
    if (!selectedBairro) return;
    const nomeInput = (document.getElementById("edit-nome") as HTMLInputElement)
      .value;
    if (!nomeInput) return;

    try {
      const updated = await atualizarBairro(selectedBairro.id, {
        nome: nomeInput,
      });
      setBairros((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b)),
      );
      setIsEditOpen(false);
      setSelectedBairro(null);
    } catch (err) {
      console.error("Erro ao atualizar bairro:", err);
    }
  };

  const handleDeleteBairro = async () => {
    if (!selectedBairro) return;

    try {
      await deletarBairro(selectedBairro.id);
      setBairros((prev) => prev.filter((b) => b.id !== selectedBairro.id));
      setIsDeleteOpen(false);
      setSelectedBairro(null);
    } catch (err) {
      console.error("Erro ao deletar bairro:", err);
    }
  };

  //Filtro por nome
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBairros = bairros.filter((bairro) =>
    bairro.nome.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <h1 className="text-3xl text-gray-800 mb-6">Bairros</h1>

                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Pesquisar bairros..."
                      className="pl-10 pr-4 py-2 w-full rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Bairro
                  </Button>
                </div>
              </div>

              {/* Tabela de bairros */}
              <div className="overflow-x-auto max-h-125 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Bairro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBairros.map((bairro) => (
                      <TableRow key={bairro.id}>
                        <TableCell>{bairro.nome}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedBairro(bairro);
                                setIsEditOpen(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBairro(bairro);
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
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Adicionar Bairro</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo bairro
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome do Bairro</Label>
                <Input id="nome" placeholder="Digite o nome do bairro" />
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
                onClick={handleCreateBairro}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Editar Bairro</DialogTitle>
              <DialogDescription>Atualize os dados do bairro</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nome">Nome do Bairro</Label>
                <Input id="edit-nome" defaultValue={selectedBairro?.nome} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateBairro}
              >
                Atualizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Exclusão */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o bairro{" "}
                <strong>{selectedBairro?.nome}</strong>? Esta ação não pode ser
                desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteBairro}
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
