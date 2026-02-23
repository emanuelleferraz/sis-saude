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
public class PerfilResponseDTO {

    private Integer id;
    private String nome;
}