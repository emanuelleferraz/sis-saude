package br.edu.ufop.tcc.sis_api.model.dto.paciente;

import br.edu.ufop.tcc.sis_api.model.enums.EnumSexoPaciente;
import lombok.Data;

@Data
public class PacienteRequestDTO {

    private String nome;
    private String cpf;
    private String telefone;
    private String dataNascimento;
    private EnumSexoPaciente sexo;
    private Integer idEndereco;
}
