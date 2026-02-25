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
import { AgenteSaudeRequestDTO, AgenteSaudeResponseDTO } from "@/types/agente";
import { UnidadeResponseDTO } from "@/types/unidade";
import { Bairro } from "@/types/bairro";
import { listarBairros } from "@/services/bairroService";
import { listarUnidades } from "@/services/unidadeService";
import {
  atualizarAgenteSaude,
  criarAgenteSaude,
  deletarAgenteSaude,
  listarAgentesSaude,
} from "@/services/agenteService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentesPageProps {
  onBack: () => void;
}

export default function AgentesPage({ onBack }: AgentesPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAgente, setSelectedAgente] =
    useState<AgenteSaudeResponseDTO | null>(null);

  const [agentes, setAgentes] = useState<AgenteSaudeResponseDTO[]>([]);
  const [unidades, setUnidades] = useState<UnidadeResponseDTO[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [unidadeId, setUnidadeId] = useState<number | null>(null);
  const [bairroId, setBairroId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentesData, unidadesData, bairrosData] = await Promise.all([
          listarAgentesSaude(),
          listarUnidades(),
          listarBairros(),
        ]);

        setAgentes(agentesData);
        setUnidades(unidadesData);
        setBairros(bairrosData);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAgente) {
      setNome(selectedAgente.nome);
      setTelefone(selectedAgente.telefone);

      const unidade = unidades.find(
        (u) => u.nome === selectedAgente.nomeUnidade,
      );
      const bairro = bairros.find((b) => b.nome === selectedAgente.nomeBairro);

      setUnidadeId(unidade?.id || null);
      setBairroId(bairro?.id || null);
    }
  }, [selectedAgente, unidades, bairros]);

  function resetForm() {
    setNome("");
    setTelefone("");
    setUnidadeId(null);
    setBairroId(null);
    setSelectedAgente(null);
  }

  async function handleCreate() {
    if (!unidadeId || !bairroId) return;

    try {
      const novo: AgenteSaudeRequestDTO = {
        nome,
        telefone,
        unidadeId,
        bairroId,
      };

      await criarAgenteSaude(novo);

      const data = await listarAgentesSaude();
      setAgentes(data);

      resetForm();
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Erro ao criar agente", error);
    }
  }

  async function handleUpdate() {
    if (!selectedAgente || !unidadeId || !bairroId) return;

    try {
      const atualizado: AgenteSaudeRequestDTO = {
        nome,
        telefone,
        unidadeId,
        bairroId,
      };

      await atualizarAgenteSaude(selectedAgente.id, atualizado);

      const data = await listarAgentesSaude();
      setAgentes(data);

      resetForm();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar agente", error);
    }
  }

  async function handleDelete() {
    if (!selectedAgente) return;

    try {
      await deletarAgenteSaude(selectedAgente.id);

      const data = await listarAgentesSaude();
      setAgentes(data);

      resetForm();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar agente", error);
    }
  }

  const filteredAgentes = agentes.filter(
    (agente) =>
      agente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.nomeBairro.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            <div className="mb-6">
              <h1 className="text-3xl text-gray-800 mb-6">Agentes de Saúde</h1>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar agentes..."
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
                  Registrar Agente
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Área de Atuação</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgentes.map((agente) => (
                  <TableRow key={agente.id}>
                    <TableCell>{agente.nome}</TableCell>
                    <TableCell>{agente.telefone}</TableCell>
                    <TableCell>{agente.nomeBairro}</TableCell>
                    <TableCell>{agente.nomeUnidade}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedAgente(agente);
                            setIsEditOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAgente(agente);
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
      {/* MODAL DE CREATE */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Registrar Agente de Saúde</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo agente
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
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="Digite o telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Área de Atuação</Label>
              <Select
                value={bairroId ? bairroId.toString() : ""}
                onValueChange={(value) => setBairroId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  {bairros.map((bairro) => (
                    <SelectItem key={bairro.id} value={bairro.id.toString()}>
                      {bairro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={unidadeId ? unidadeId.toString() : ""}
                onValueChange={(value) => setUnidadeId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.nome}
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
      {/* MODAL DE UPDATE */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Editar Agente de Saúde</DialogTitle>
            <DialogDescription>Atualize os dados do agente</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome Completo</Label>
              <Input id="edit-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input
                id="edit-telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Área de Atuação</Label>
              <Select
                value={bairroId ? bairroId.toString() : ""}
                onValueChange={(value) => setBairroId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  {bairros.map((bairro) => (
                    <SelectItem key={bairro.id} value={bairro.id.toString()}>
                      {bairro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={unidadeId ? unidadeId.toString() : ""}
                onValueChange={(value) => setUnidadeId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.nome}
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
              Tem certeza que deseja excluir o agente{" "}
              <strong>{selectedAgente?.nome}</strong>? Esta ação não pode ser
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
