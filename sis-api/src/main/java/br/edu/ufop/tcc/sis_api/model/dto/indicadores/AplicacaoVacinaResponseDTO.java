package br.edu.ufop.tcc.sis_api.model.dto.indicadores;

import java.time.LocalDateTime;

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
public class AplicacaoVacinaResponseDTO {

    private Integer id;
    private LocalDateTime dataAplicacao;
    private String dose;
    private String nomePaciente;
    private String nomeVacina;
    private String nomeEnfermeiro;
}