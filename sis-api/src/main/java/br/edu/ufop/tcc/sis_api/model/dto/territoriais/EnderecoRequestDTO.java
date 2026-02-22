package br.edu.ufop.tcc.sis_api.model.dto.territoriais;

import lombok.Data;

@Data
public class EnderecoRequestDTO {

    private String rua;
    private String numero;
    private String complemento;
    private String cep;
    private String cidade;
    private Integer idBairro;
}
