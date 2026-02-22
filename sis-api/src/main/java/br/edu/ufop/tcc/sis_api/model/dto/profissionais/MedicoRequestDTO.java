package br.edu.ufop.tcc.sis_api.model.dto.profissionais;

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
public class MedicoRequestDTO {

    private String nome;
    private String crm;
    private String especialidade;
}
