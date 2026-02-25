export type EnumTypeEnfermagem =
  | "Enfermeiro"
  | "Tecnico_Enfermagem";

export interface ProfissionalEnfermagemRequestDTO {
  nome: string;
  coren: string;
  telefone: string;
  unidadeId: number;
  tipo: EnumTypeEnfermagem;
}

export interface ProfissionalEnfermagemResponseDTO {
  id: number;
  nome: string;
  coren: string;
  telefone: string;
  unidadeId: number;
  nomeUnidade: string;
  tipo: EnumTypeEnfermagem;
}