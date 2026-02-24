// Tipagem para paciente
export interface PacienteResponseDTO {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  sexo: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  bairro: string;

  endereco: string;  
  idEndereco: number;

}