export interface EnderecoRequestDTO {
  rua: string;
  numero: string;
  complemento?: string;
  cep: string;
  cidade: string;
  idBairro: number;
}

export interface EnderecoResponseDTO {
  id: number;
  rua: string;
  numero: string;
  complemento?: string;
  cep: string;
  cidade: string;
  bairroNome: string;
}