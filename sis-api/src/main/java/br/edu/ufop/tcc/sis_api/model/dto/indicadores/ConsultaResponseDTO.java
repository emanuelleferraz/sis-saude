package br.edu.ufop.tcc.sis_api.model.dto.indicadores;

import java.util.List;

import br.edu.ufop.tcc.sis_api.model.dto.doenca.DoencaResumoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaResponseDTO {

    private Integer id;
    private String dataConsulta;
    private String observacoes;

    private Integer pacienteId;
    private String pacienteNome;

    private Integer medicoId;
    private String medicoNome;

    private Integer unidadeId;
    private String unidadeNome;

    private List<DoencaResumoDTO> doencas;
}
