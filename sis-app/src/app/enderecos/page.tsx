'use client';
import { EnderecoResponseDTO, EnderecoRequestDTO } from '@/types/endereco';
import { listarEnderecos, criarEndereco, atualizarEndereco, deletarEndereco } from '@/services/enderecoService';
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
import { Bairro } from '@/types/bairro';
import { listarBairros } from '@/services/bairroService';

interface EnderecosPageProps {
  onBack: () => void;
}

export default function EnderecosPage({ onBack }: EnderecosPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEndereco, setSelectedEndereco] = useState<any>(null);

  // Campos do modal de criação
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [cep, setCep] = useState("");
    const [cidade, setCidade] = useState("");
    const [idBairro, setidBairro] = useState<number | null>(null);


    const [enderecos, setEnderecos] = useState<EnderecoResponseDTO[]>([]);
    const [bairros, setBairros] = useState<Bairro[]>([]);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBairros = async () => {
            try {
            const data = await listarBairros();
            setBairros(data);
            } catch (err) {
            console.error("Erro ao carregar bairros:", err);
            }
        };
        fetchBairros();
    }, []);

    useEffect(() => {
        const fetchEnderecos = async () => {
            try {
            const data = await listarEnderecos();
            setEnderecos(data);
            } catch (err) {
            console.error("Erro ao carregar endereços:", err);
            } finally {
            setLoading(false);
            }
        };
        fetchEnderecos();
    }, []);

    useEffect(() => {
        if (selectedEndereco) {
            setRua(selectedEndereco.rua);
            setNumero(selectedEndereco.numero);
            setComplemento(selectedEndereco.complemento || '');
            setCep(selectedEndereco.cep);
            setCidade(selectedEndereco.cidade);
            const bairro = bairros.find(b => b.nome === selectedEndereco.bairroNome);
            setidBairro(bairro?.id || null);
        }
    }, [selectedEndereco, bairros]);

    const handleCreateEndereco = async () => {
        if (!rua || !numero || !cep || !cidade || !idBairro) return;

        try {
            const newEndereco: EnderecoRequestDTO = {
            rua,
            numero,
            complemento,
            cep,
            cidade,
            idBairro: idBairro,
            };

            await criarEndereco(newEndereco);
            const data = await listarEnderecos();
            setEnderecos(data);
            setRua('');
            setNumero('');
            setComplemento('');
            setCep('');
            setCidade('');
            setidBairro(null);
            setIsRegisterOpen(false);
        } catch (err) {
            console.error("Erro ao criar endereço:", err);
        }
    };

    const handleUpdateEndereco = async () => {
        if (!selectedEndereco || !rua || !numero || !cep || !cidade || !idBairro) return;

        try {
            const updatedEndereco: EnderecoRequestDTO = {
            rua,
            numero,
            complemento,
            cep,
            cidade,
            idBairro: idBairro,
            };

            await atualizarEndereco(selectedEndereco.id, updatedEndereco);
            const data = await listarEnderecos();
            setRua('');
            setNumero('');
            setComplemento('');
            setCep('');
            setCidade('');
            setidBairro(null);
            setEnderecos(data);
            setIsEditOpen(false);
            setSelectedEndereco(null);
        } catch (err) {
            console.error("Erro ao atualizar endereço:", err);
        }
    };

    const handleDeleteEndereco = async () => {
        if (!selectedEndereco) return;

        try {
            await deletarEndereco(selectedEndereco.id);
            const data = await listarEnderecos();
            setEnderecos(data);
            setIsDeleteOpen(false);
            setSelectedEndereco(null);
        } catch (err: any) {
            console.error("Erro ao deletar endereço:", err);

            if (err.response?.status === 500 || err.message.includes("violação de chave estrangeira")) {
                alert("Não é possível deletar este endereço porque ele está em uso por uma unidade.");
            } else {
                alert("Ocorreu um erro ao tentar deletar o endereço.");
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const filteredEnderecos = enderecos.filter((endereco) =>
        endereco.rua.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
              <h1 className="text-3xl text-gray-800 mb-6">Endereços</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar endereços..."
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
                  Adicionar Endereço
                </Button>
              </div>
            </div>

            {/* Tabela de endereços */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rua</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>CEP</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnderecos.map((endereco) => (
                  <TableRow key={endereco.id}>
                    <TableCell>{endereco.rua}</TableCell>
                    <TableCell>{endereco.numero}</TableCell>
                    <TableCell>{endereco.cep}</TableCell>
                    <TableCell>{endereco.cidade}</TableCell>
                    <TableCell>{endereco.bairroNome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedEndereco(endereco);
                            setIsEditOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEndereco(endereco);
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
            <DialogTitle>Adicionar Endereço</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo endereço
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rua">Rua</Label>
              <Input id="rua" placeholder="Digite o nome da rua" value={rua} onChange={(e) => setRua(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" placeholder="Digite o número" value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" placeholder="Digite a cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Select value={idBairro?.toString() || ""} onValueChange={(value) => setidBairro(Number(value))}>
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
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" placeholder="Digite o complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateEndereco}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Editar Endereço</DialogTitle>
            <DialogDescription>
              Atualize os dados do endereço
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-rua">Rua</Label>
              <Input id="edit-rua" value={rua} onChange={(e) => setRua(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-numero">Número</Label>
              <Input id="edit-numero" placeholder="Digite o número" value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-cep">CEP</Label>
              <Input id="edit-cep" value={cep} onChange={(e) => setCep(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-cidade">Cidade</Label>
              <Input id="edit-cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bairro">Bairro</Label>
              <Select value={idBairro?.toString() || ""} onValueChange={(value) => setidBairro(Number(value))}>
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
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" placeholder="Digite o complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateEndereco}>
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
              Tem certeza que deseja excluir o endereço <strong>{selectedEndereco?.rua}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleDeleteEndereco}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
