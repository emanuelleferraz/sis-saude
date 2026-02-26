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
public class DistribuicaoDoencaDTO {

    private String doenca;
    private Long totalCasos;
}
