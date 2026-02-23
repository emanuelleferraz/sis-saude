package br.edu.ufop.tcc.sis_api.model.dto.indicadores;

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
public class VacinaResponseDTO {

    private Integer id;
    private String nome;
    private String fabricante;
    private String dosagem;
}