package br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores;

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
public class TendenciaTrimestralDTO {

    private Long ano;
    private Long trimestre;
    private Long totalCasos;

    public TendenciaTrimestralDTO(Number ano, Number trimestre, Long totalCasos) {
        this.ano = ano.longValue();
        this.trimestre = trimestre.longValue();
        this.totalCasos = totalCasos;
    }
}
