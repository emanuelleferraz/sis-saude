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
public class CardResumoVacinaDTO {

    private Long pessoasVacinadas;
    private Long dosesAplicadas;
    private String vacinaMaisAplicada;
    private String bairroMenorCobertura;
}
