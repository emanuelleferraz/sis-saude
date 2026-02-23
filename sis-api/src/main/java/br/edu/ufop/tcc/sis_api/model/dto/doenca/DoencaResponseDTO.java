package br.edu.ufop.tcc.sis_api.model.dto.doenca;

import br.edu.ufop.tcc.sis_api.model.enums.EnumTypeDoenca;
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
public class DoencaResponseDTO {

    private Integer id;
    private String nome;
    private EnumTypeDoenca tipo;
    private String classificacao;
}
