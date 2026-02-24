package br.edu.ufop.tcc.sis_api.model.dto.paciente;

import java.time.LocalDate;
import java.util.List;

import br.edu.ufop.tcc.sis_api.model.dto.indicadores.AplicacaoVacinaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.ConsultaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VisitaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.enums.EnumSexoPaciente;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class PacienteResumoResponseDTO {

    private Integer id;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private EnumSexoPaciente sexo;
    private String telefone;

    private List<ConsultaResponseDTO> consultas;
    private List<AplicacaoVacinaResponseDTO> vacinas;
    private List<VisitaResponseDTO> visitas;
}