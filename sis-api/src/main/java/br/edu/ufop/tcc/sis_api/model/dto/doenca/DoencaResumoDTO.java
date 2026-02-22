package br.edu.ufop.tcc.sis_api.model.dto.doenca;

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
public class DoencaResumoDTO {

    private Integer id;
    private String nome;
}
