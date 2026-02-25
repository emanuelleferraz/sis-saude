export interface UsuarioRequestDTO {
  nome: string;
  email: string;
  senha: string;
  perfilId: number;
}

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  email: string;
  perfilNome: string;
}

export interface UsuarioUpdateDTO {
  nome: string;
  email: string;
  perfilId: number;
}