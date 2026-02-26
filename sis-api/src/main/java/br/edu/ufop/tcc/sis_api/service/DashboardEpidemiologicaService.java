package br.edu.ufop.tcc.sis_api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.epidemiologica.DashboardEpidemiologicaDTO;
import br.edu.ufop.tcc.sis_api.repository.DashboardEpidemiologicaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardEpidemiologicaService {

    private final DashboardEpidemiologicaRepository repository;

    public DashboardEpidemiologicaDTO getDashboard() {

        LocalDate dataLimite = LocalDate.now().minusDays(90);
        LocalDateTime dataLimiteDateTime = dataLimite.atStartOfDay();

        return DashboardEpidemiologicaDTO.builder()
                .resumo(repository.buscarResumo(dataLimiteDateTime))
                .distribuicao(repository.distribuicao())
                .incidenciaPorBairro(repository.incidencia())
                .tendenciaTrimestral(repository.tendencia())
                .alertas(List.of()) 
                .build();
    }
}