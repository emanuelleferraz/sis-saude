package br.edu.ufop.tcc.sis_api.model.dto.paciente;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PacienteResponseDTO {

    private Integer id;
    private String nome;
    private String cpf;
    private String telefone;
    private String dataNascimento;
    private String cidade;
    private String bairro;
}
