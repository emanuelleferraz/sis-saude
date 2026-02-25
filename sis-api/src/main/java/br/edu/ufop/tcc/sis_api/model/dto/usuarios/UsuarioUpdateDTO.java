package br.edu.ufop.tcc.sis_api.model.dto.usuarios;

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
public class UsuarioUpdateDTO {

    private String nome;
    private String email;
    private Integer perfilId;
}
