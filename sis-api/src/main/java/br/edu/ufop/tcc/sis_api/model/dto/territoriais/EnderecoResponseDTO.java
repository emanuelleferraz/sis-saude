package br.edu.ufop.tcc.sis_api.model.dto.territoriais;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnderecoResponseDTO {

    private Integer id;
    private String rua;
    private String numero;
    private String complemento;
    private String cep;
    private String cidade;
    private String bairroNome;
}
