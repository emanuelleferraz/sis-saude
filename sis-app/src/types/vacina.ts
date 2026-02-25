export interface VacinaRequestDTO {
  nome: string;
  fabricante: string;
  dosagem: string;
}

export interface VacinaResponseDTO {
  id: number;
  nome: string;
  fabricante: string;
  dosagem: string;
}