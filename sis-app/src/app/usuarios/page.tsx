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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SharedMenu } from '@/components/SharedMenu';
import { PerfilResponseDTO } from '@/types/perfil';
import { UsuarioRequestDTO, UsuarioResponseDTO, UsuarioUpdateDTO } from '@/types/usuario';
import { atualizarUsuario, criarUsuario, deletarUsuario, listarUsuarios } from '@/services/usuarioService';
import { listarPerfis } from '@/services/perfilService';
import { Value } from '@radix-ui/react-select';

interface UsuariosPageProps {
  onBack: () => void;
}

export default function UsuariosPage({ onBack }: UsuariosPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
 const [selectedUsuario, setSelectedUsuario] = useState<UsuarioResponseDTO | null>(null);

    const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
    const [perfis, setPerfis] = useState<PerfilResponseDTO[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [perfilId, setPerfilId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const [usuariosData, perfisData] = await Promise.all([
                listarUsuarios(),
                listarPerfis(),
            ]);

            setUsuarios(usuariosData);
            setPerfis(perfisData);
            } catch (err) {
            console.error("Erro ao carregar dados:", err);
            } finally {
            setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
      if (selectedUsuario) {
        setNome(selectedUsuario.nome);
        setEmail(selectedUsuario.email);

        const perfil = perfis.find(
          (p) => p.nome === selectedUsuario.perfilNome,
        );

        setPerfilId(perfil?.id || null);
      }
    }, [selectedUsuario, perfis]);

    const resetForm = () => {
        setNome("");
        setEmail("");
        setSenha("");
        setPerfilId(null);
    };

    const handleCreateUsuario = async () => {
      if (!nome || !email || !senha || perfilId == null) return;

      try {
        const newUsuario: UsuarioRequestDTO = {
          nome,
          email,
          senha,
          perfilId,
        };

        await criarUsuario(newUsuario);
        const data = await listarUsuarios();
        setUsuarios(data);

        setIsRegisterOpen(false);
        resetForm();
      } catch (err) {
        console.error("Erro ao criar usuário:", err);
      }
    };

    const handleUpdateUsuario = async () => {
      if (!selectedUsuario || !nome || !email || perfilId == null) return;

      try {
        const updatedUsuario: UsuarioUpdateDTO = {
          nome,
          email,
          perfilId,
        };

        await atualizarUsuario(selectedUsuario.id, updatedUsuario);
        const data = await listarUsuarios();
        setUsuarios(data);

        setSelectedUsuario(null);
        resetForm();
        setIsEditOpen(false);
      } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
      }
    };

    const handleDeleteUsuario = async () => {
        if (!selectedUsuario) return;

        try {
            await deletarUsuario(selectedUsuario.id);
            const data = await listarUsuarios();
            setUsuarios(data);

            setSelectedUsuario(null);
            setIsDeleteOpen(false);
        } catch (err) {
            console.error("Erro ao deletar usuário:", err);
            alert("Erro ao deletar usuário.");
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
              <h1 className="text-3xl text-gray-800 mb-6">Usuários</h1>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar usuários..."
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
                  Adicionar Usuário
                </Button>
              </div>
            </div>

            {/* Tabela de usuários */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.perfilNome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUsuario(usuario);
                            setIsEditOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUsuario(usuario);
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
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Digite o nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" placeholder="Digite a senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perfil">Perfil</Label>
              <Select value={perfilId?.toString() || ""} onValueChange={(value) => setPerfilId(Number(value))}>
                <SelectTrigger id="perfil">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {perfis.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id.toString()}>
                      {perfil.nome}
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateUsuario}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input id="edit-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-perfil">Perfil</Label>
              <Select value={perfilId?.toString() || ""} onValueChange={(value) => setPerfilId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {perfis.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id.toString()}>
                      {perfil.nome}
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateUsuario}>
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
              Tem certeza que deseja excluir o usuário <strong>{selectedUsuario?.nome}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleDeleteUsuario}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
