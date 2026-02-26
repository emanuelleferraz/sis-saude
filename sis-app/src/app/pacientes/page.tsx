"use client";

import { useEffect, useState } from "react";
import {
  atualizarPaciente,
  criarPaciente,
  deletarPaciente,
  getPacientes,
} from "@/services/pacienteService";
import { PacienteResponseDTO } from "@/types/paciente";

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
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bairro } from "@/types/bairro";
import { EnderecoResponseDTO } from "@/types/endereco";
import { listarBairros } from "@/services/bairroService";
import { listarEnderecos } from "@/services/enderecoService";
import { useRouter } from "next/navigation";

interface PacientesPageProps {
  onBack: () => void;
  moduleContext?: string;
  onPacienteSelect?: (paciente: any) => void;
}

export default function PacientesPage({
  onBack,
  moduleContext,
  onPacienteSelect,
}: PacientesPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PacienteResponseDTO | null>(null);

  const getPageTitle = () => {
    if (moduleContext === "cronicas") return "Pacientes - Doenças Crônicas";
    if (moduleContext === "epidemiologicas")
      return "Pacientes - Doenças Epidemiológicas";
    return "Pacientes";
  };

  const router = useRouter();

  // Criando os estados reais dos pacientes e seus atributos
  const [pacientes, setPacientes] = useState<PacienteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [enderecos, setEnderecos] = useState<EnderecoResponseDTO[]>([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar pacientes");
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    listarBairros().then(setBairros);
    listarEnderecos().then(setEnderecos);
  }, []);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    sexo: "" as "MASCULINO" | "FEMININO" | "",
    idEndereco: null as number | null,
  });

  const [editNome, setEditNome] = useState("");
  const [editCpf, setEditCpf] = useState("");
  const [editDataNascimento, setEditDataNascimento] = useState("");
  const [editSexo, setEditSexo] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editEnderecoId, setEditEnderecoId] = useState<number | null>(null);

  // Handle edit button click
  const handleOpenEdit = (paciente: PacienteResponseDTO) => {
    setSelectedPatient(paciente);

    setEditNome(paciente.nome);
    setEditCpf(paciente.cpf);
    setEditTelefone(paciente.telefone);
    setEditDataNascimento(paciente.dataNascimento);
    setEditSexo(paciente.sexo);
    setEditEnderecoId(paciente.idEndereco);

    setIsEditOpen(true);
  };

  // Apenas para melhorar visualização do CPF
  const formatCPF = (cpf: string) => {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

// Apenas para melhorar inserção do telefone
  const formatTelefone = (telefone: string) => {
    let num = telefone.replace(/\D/g, "");
    num = num.substring(0, 11);

    // Aplica máscara
    if (num.length > 6) {
      return `(${num.substring(0, 2)}) ${num.substring(2, 7)}-${num.substring(7)}`;
    } else if (num.length > 2) {
      return `(${num.substring(0, 2)}) ${num.substring(2)}`;
    } else if (num.length > 0) {
      return `(${num}`;
    }

    return "";
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPacientes = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl text-gray-800 mb-6">{getPageTitle()}</h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquisar pacientes..."
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
                  Registrar Paciente
                </Button>
              </div>
            </div>

            {/* Tabela de pacientes */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6}>Carregando...</TableCell>
                  </TableRow>
                )}

                {error && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-red-600">
                      {error}
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell>{paciente.nome}</TableCell>
                      <TableCell>{formatCPF(paciente.cpf)}</TableCell>
                      <TableCell>
                        {new Date(paciente.dataNascimento).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" },
                        )}
                      </TableCell>
                      <TableCell>{paciente.sexo}</TableCell>
                      <TableCell>{paciente.bairro}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => {
                            setSelectedPatient(paciente);
                            handleOpenEdit(paciente);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatient(paciente);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/pacientes/${paciente.id}/resumo/`)
                          }
                          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4 text-gray-600" />
                        </button>
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
            <DialogTitle>Registrar Paciente</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo paciente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Digite o nome completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: formatCPF(e.target.value) })
                }
                placeholder="000.000.000-00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telefone: formatTelefone(e.target.value),
                  })
                }
                placeholder="(99) 99999-9999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataNasc">Data de Nascimento</Label>
              <Input
                id="dataNasc"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) =>
                  setFormData({ ...formData, dataNascimento: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={formData.sexo}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    sexo: value as "MASCULINO" | "FEMININO",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEMININO">Feminino</SelectItem>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, idEndereco: Number(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o endereço" />
                </SelectTrigger>
                <SelectContent>
                  {enderecos.map((endereco) => (
                    <SelectItem key={endereco.id} value={String(endereco.id)}>
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
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                try {
                  if (!formData.idEndereco) {
                    alert("Por favor, selecione um endereço válido.");
                    return;
                  }

                  console.log("Dados a enviar:", {
                    ...formData,
                    cpf: formData.cpf.replace(/\D/g, ""),
                    telefone: formData.telefone.replace(/\D/g, ""),
                  });

                  await criarPaciente({
                    ...formData,
                    cpf: formData.cpf.replace(/\D/g, ""),
                    telefone: formData.telefone.replace(/\D/g, ""),
                    idEndereco: formData.idEndereco,
                  });
                  const updated = await getPacientes();
                  setPacientes(updated);

                  setIsRegisterOpen(false);
                  //Limpar o formulário
                  setFormData({
                    nome: "",
                    cpf: "",
                    telefone: "",
                    dataNascimento: "",
                    sexo: "" as "MASCULINO" | "FEMININO" | "",
                    idEndereco: null,
                  });
                } catch (err) {
                  console.error(err);
                  alert(
                    "Erro ao criar paciente. Verifique os dados e tente novamente.",
                  );
                }
              }}
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
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>Atualize os dados do paciente</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome Completo</Label>
              <Input
                id="edit-nome"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-cpf">CPF</Label>
              <Input
                id="edit-cpf"
                value={editCpf}
                onChange={(e) => setEditCpf(formatCPF(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input
                id="edit-telefone"
                type="tel"
                value={editTelefone}
                onChange={(e) =>
                  setEditTelefone(formatTelefone(e.target.value))
                }
                placeholder="(99) 99999-9999"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dataNasc">Data de Nascimento</Label>
              <Input
                id="edit-dataNasc"
                type="date"
                value={editDataNascimento}
                onChange={(e) => setEditDataNascimento(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sexo">Sexo</Label>
              <Select
                value={editSexo}
                onValueChange={(value) => setEditSexo(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEMININO">Feminino</SelectItem>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-endereco">Endereço</Label>
              <Select
                value={editEnderecoId?.toString()}
                onValueChange={(value) => setEditEnderecoId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o endereço" />
                </SelectTrigger>
                <SelectContent>
                  {enderecos.map((endereco) => (
                    <SelectItem
                      key={endereco.id}
                      value={endereco.id.toString()}
                    >
                      {endereco.rua}, {endereco.numero} - {endereco.bairroNome},{" "}
                      {endereco.cidade}
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
              onClick={async () => {
                try {
                  if (!selectedPatient || !editEnderecoId) return;

                  await atualizarPaciente(selectedPatient.id, {
                    nome: editNome,
                    cpf: editCpf.replace(/\D/g, ""),
                    telefone: editTelefone.replace(/\D/g, ""),
                    dataNascimento: editDataNascimento,
                    sexo: editSexo,
                    idEndereco: editEnderecoId,
                  });

                  const updated = await getPacientes();
                  setPacientes(updated);

                  setIsEditOpen(false);
                } catch (err) {
                  console.error(err);
                  alert("Erro ao atualizar paciente");
                }
              }}
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
              Tem certeza que deseja excluir o paciente{" "}
              <strong>{selectedPatient?.nome}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (!selectedPatient) return;

                try {
                  await deletarPaciente(selectedPatient.id);
                  const updated = await getPacientes();
                  setPacientes(updated);
                  setIsDeleteOpen(false);
                  setSelectedPatient(null);
                } catch (err) {
                  console.error(err);
                  alert("Erro ao excluir paciente");
                }
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
