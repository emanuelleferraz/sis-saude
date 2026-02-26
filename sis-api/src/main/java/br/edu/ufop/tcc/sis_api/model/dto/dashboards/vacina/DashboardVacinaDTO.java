package br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina;

import java.util.List;

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
public class DashboardVacinaDTO {

    private CardResumoVacinaDTO resumo;

    private List<DistribuicaoVacinaDTO> distribuicaoVacinas; 

    private List<EvolucaoDosesTrimestreDTO> evolucaoTrimestral; 

    private List<CoberturaVacinalBairroDTO> coberturaPorBairro; 
}
