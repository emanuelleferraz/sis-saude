package br.edu.ufop.tcc.sis_api.model.dto.paciente;

import lombok.Data;

@Data
public class PacienteRequestDTO {

    private String nome;
    private String cpf;
    private String telefone;
    private String dataNascimento;
    private Integer idEndereco;
}
