export interface UnidadeRequestDTO {
  nome: string;
  enderecoId: number;
  telefone: string;
}

export interface UnidadeResponseDTO {
  id: number;
  nome: string;
  telefone: string;

  enderecoId: number;
  enderecoFormatado: string; // rua + numero + bairro
}