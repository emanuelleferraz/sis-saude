package br.edu.ufop.tcc.sis_api.model.dto.territoriais;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BairroResponseDTO {
    private Integer id;
    private String nome;
}