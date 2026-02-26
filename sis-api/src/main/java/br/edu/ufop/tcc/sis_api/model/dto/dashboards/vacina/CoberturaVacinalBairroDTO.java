package br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina;

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
public class CoberturaVacinalBairroDTO {

    private String bairro;
    private Long totalAplicacoes;
}
