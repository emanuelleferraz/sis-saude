export type TipoDoenca = "TRANSMISSIVEL" | "CRONICA";

export interface DoencaRequestDTO {
  nome: string;
  tipo: TipoDoenca;
  classificacao: string;
}

export interface DoencaResponseDTO {
  id: number;
  nome: string;
  tipo: TipoDoenca;
  classificacao: string;
}