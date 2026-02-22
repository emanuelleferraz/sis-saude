package br.edu.ufop.tcc.sis_api.model.dto.unidade;

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
public class UnidadeRequestDTO {

    private String nome;
    private Integer enderecoId;
    private String telefone;
}
