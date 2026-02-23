package br.edu.ufop.tcc.sis_api.model.dto.indicadores;

import java.time.LocalDateTime;

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
public class ConsultaRequestDTO {

    private LocalDateTime dataConsulta;
    private String observacoes;

    private Integer pacienteId;
    private Integer medicoId;
    private Integer unidadeId;

    private Integer doencaId;
}
