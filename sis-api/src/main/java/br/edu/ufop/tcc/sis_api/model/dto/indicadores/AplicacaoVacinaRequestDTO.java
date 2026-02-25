package br.edu.ufop.tcc.sis_api.model.dto.indicadores;

import java.time.LocalDate;

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
public class AplicacaoVacinaRequestDTO {

    private LocalDate dataAplicacao;
    private String dose;
    private Integer pacienteId;
    private Integer vacinaId;
    private Integer enfermeiroId;
    private Integer unidadeId;
}
