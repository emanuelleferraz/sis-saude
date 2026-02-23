package br.edu.ufop.tcc.sis_api.model.dto.profissionais;

import br.edu.ufop.tcc.sis_api.model.enums.EnumTypeEnfermagem;
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
public class ProfissionalEnfermagemRequestDTO {

    private String nome;
    private String coren;
    private String telefone;
    private Integer unidadeId;
    private EnumTypeEnfermagem tipo;
}
