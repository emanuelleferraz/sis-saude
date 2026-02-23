package br.edu.ufop.tcc.sis_api.model.dto.indicadores;


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
public class ConsultaResponseDTO {

    private Integer id;
    private String dataConsulta;
    private String observacoes;
    
    private String pacienteNome;
    private String medicoNome;

    private String unidadeNome;

    private String doencaNome;
}
