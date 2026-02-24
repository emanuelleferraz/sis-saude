export interface Endereco {
  id: number;
  rua: string;
  numero: string;
  complemento?: string; // pode ser opcional
  cep: string;
  cidade: string;
  bairroNome: string;
}