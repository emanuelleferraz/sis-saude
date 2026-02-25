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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UnidadeRequestDTO, UnidadeResponseDTO } from '@/types/unidade';
import { EnderecoResponseDTO } from '@/types/endereco';
import { atualizarUnidade, criarUnidade, deletarUnidade, listarUnidades } from '@/services/unidadeService';
import { listarEnderecos } from '@/services/enderecoService';

interface UnidadesPSFPageProps {
  onBack: () => void;
}

export default function UnidadesPSFPage({ onBack }: UnidadesPSFPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeResponseDTO | null>(null);

    const [unidades, setUnidades] = useState<UnidadeResponseDTO[]>([]);
    const [enderecos, setEnderecos] = useState<EnderecoResponseDTO[]>([]);
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [enderecoId, setEnderecoId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      async function fetchData() {
        try {
          const [unidadesData, enderecosData] = await Promise.all([
            listarUnidades(),
            listarEnderecos(),
          ]);

          setUnidades(unidadesData);
          setEnderecos(enderecosData);
        } catch (error) {
          console.error("Erro ao carregar dados", error);
        }
      }

      fetchData();
    }, []);

    useEffect(() => {
      if (selectedUnidade) {
        setNome(selectedUnidade.nome);
        setTelefone(selectedUnidade.telefone);
        setEnderecoId(selectedUnidade.enderecoId);
      }
    }, [selectedUnidade]);

    function resetForm() {
      setNome("");
      setTelefone("");
      setEnderecoId(null);
      setSelectedUnidade(null);
    }

    async function handleCreate() {
      if (!enderecoId) return;

      try {
        const novaUnidade: UnidadeRequestDTO = {
          nome,
          telefone,
          enderecoId,
        };

        await criarUnidade(novaUnidade);

        const data = await listarUnidades();
        setUnidades(data);

        setIsRegisterOpen(false);
        resetForm();
      } catch (error) {
        console.error("Erro ao criar unidade", error);
      }
    }

    async function handleUpdate() {
      if (!selectedUnidade || !enderecoId) return;

      try {
        const unidadeAtualizada: UnidadeRequestDTO = {
          nome,
          telefone,
          enderecoId,
        };

        await atualizarUnidade(selectedUnidade.id, unidadeAtualizada);

        const data = await listarUnidades();
        setUnidades(data);

        resetForm();
        setIsEditOpen(false);
      } catch (error) {
        console.error("Erro ao atualizar unidade", error);
      }
    }

    async function handleDelete() {
      if (!selectedUnidade) return;

      try {
        await deletarUnidade(selectedUnidade.id);

        const data = await listarUnidades();
        setUnidades(data);

        resetForm();
        setIsDeleteOpen(false);
      } catch (error) {
        console.error("Erro ao deletar unidade", error);
      }
    }

    const filteredUnidades = unidades.filter(
    (unidade) =>
        unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidade.enderecoFormatado?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Apenas para melhorar inserção do telefone
    const formatTelefone = (telefone: string) => {
    let num = telefone.replace(/\D/g, ""); 
    num = num.substring(0, 11); 

    if (num.length <= 10) {
        // (99) 9999-9999
        return num
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        // (99) 99999-9999
        return num
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
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
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
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
          <SharedMenu onMenuItemClick={(key) => {
            if (key === 'sobre') {
              onBack();
            }
          }} />
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
              <h1 className="text-3xl text-gray-800 mb-6">Unidades PSF</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar unidades..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {resetForm(); setIsRegisterOpen(true);}}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Unidade PSF
                </Button>
              </div>
            </div>

            {/* Tabela de unidades */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnidades.map((unidade) => (
                  <TableRow key={unidade.id}>
                    <TableCell>{unidade.nome}</TableCell>
                    <TableCell>{unidade.telefone}</TableCell>
                    <TableCell>{unidade.enderecoFormatado}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUnidade(unidade);
                            setIsEditOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUnidade(unidade);
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
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Adicionar Unidade PSF</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova unidade
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Digite o nome da unidade" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" placeholder="Digite o telefone da unidade" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Select value={enderecoId?.toString()} onValueChange={(value) => setEnderecoId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o endereço" />
                </SelectTrigger>
                <SelectContent>
                  {enderecos.map((endereco) => (
                    <SelectItem key={endereco.id} value={endereco.id.toString()}>
                      {endereco.rua}, {endereco.numero} - {endereco.bairroNome}
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Editar Unidade PSF</DialogTitle>
            <DialogDescription>
              Atualize os dados da unidade
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input id="edit-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" placeholder="Digite o telefone da unidade" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-endereco">Endereço</Label>
              <Select value={enderecoId?.toString()} onValueChange={(value) => setEnderecoId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o endereço" />
                </SelectTrigger>
                <SelectContent>
                  {enderecos.map((endereco) => (
                    <SelectItem key={endereco.id} value={endereco.id.toString()}>
                      {endereco.rua}, {endereco.numero} - {endereco.bairroNome}
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>
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
              Tem certeza que deseja excluir a unidade <strong>{selectedUnidade?.nome}</strong>? Esta ação não pode ser desfeita.
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
