package br.edu.ufop.tcc.sis_api.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.CardResumoVacinaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.DashboardVacinaDTO;
import br.edu.ufop.tcc.sis_api.repository.DashboardVacinaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardVacinaService {

    private final DashboardVacinaRepository repository;

    public DashboardVacinaDTO obterDashboard() {

        String vacinaMaisAplicada = repository.vacinaMaisAplicada(PageRequest.of(0,1))
                .stream()
                .findFirst()
                .orElse("N/A");

        String bairroMenorCobertura = repository.bairroMenorCobertura(PageRequest.of(0,1))
                .stream()
                .findFirst()
                .orElse("N/A");

        CardResumoVacinaDTO resumo = CardResumoVacinaDTO.builder()
                .pessoasVacinadas(repository.totalPacientesVacinados())
                .dosesAplicadas(repository.totalDosesAplicadas())
                .vacinaMaisAplicada(vacinaMaisAplicada)
                .bairroMenorCobertura(bairroMenorCobertura)
                .build();

        return DashboardVacinaDTO.builder()
                .resumo(resumo)
                .distribuicaoVacinas(repository.distribuicaoPorVacina())
                .evolucaoTrimestral(repository.evolucaoTrimestral())
                .coberturaPorBairro(repository.coberturaVacinalPorBairro())
                .aplicacoesPorUnidade(repository.aplicacoesPorUnidade())
                .build();
    }
}