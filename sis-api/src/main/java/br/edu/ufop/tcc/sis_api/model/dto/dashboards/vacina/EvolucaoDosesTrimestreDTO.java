package br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina;


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
public class EvolucaoDosesTrimestreDTO {

    private Long ano;
    private Long trimestre;
    private Long totalDoses;

    public EvolucaoDosesTrimestreDTO(Number ano, Number trimestre, Long totalDoses) {
        this.ano = ano.longValue();
        this.trimestre = trimestre.longValue();
        this.totalDoses = totalDoses;
    }
}
