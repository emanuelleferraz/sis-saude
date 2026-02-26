package br.edu.ufop.tcc.sis_api.model.dto.dashboards.cronica;

import java.util.List;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.AlertaBairroDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.CardResumoDoencaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.DistribuicaoDoencaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.IncidenciaPorBairroDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.TendenciaTrimestralDTO;
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
public class DashboardCronicaDTO {

    private CardResumoDoencaDTO resumo;
    private List<DistribuicaoDoencaDTO> distribuicao;
    private List<IncidenciaPorBairroDTO> incidenciaPorBairro;
    private List<TendenciaTrimestralDTO> tendenciaTrimestral;
    private List<AlertaBairroDTO> alertas;
}
