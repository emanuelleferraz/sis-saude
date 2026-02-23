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
public class VisitaResponseDTO {

    private Integer id;
    private LocalDateTime dataVisita;
    private String observacoes;
    private Integer pacienteId;
    private Integer agenteId;
}
