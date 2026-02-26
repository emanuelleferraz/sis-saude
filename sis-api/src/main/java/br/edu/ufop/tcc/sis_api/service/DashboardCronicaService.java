package br.edu.ufop.tcc.sis_api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.cronica.DashboardCronicaDTO;
import br.edu.ufop.tcc.sis_api.repository.DashboardCronicaRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class DashboardCronicaService {

    private final DashboardCronicaRepository repository;

    public DashboardCronicaDTO getDashboard() {

        LocalDate dataLimite = LocalDate.now().minusDays(90);
        LocalDateTime dataLimiteDateTime = dataLimite.atStartOfDay();

        return DashboardCronicaDTO.builder()
                .resumo(repository.buscarResumo(dataLimiteDateTime))
                .distribuicao(repository.distribuicao())
                .incidenciaPorBairro(repository.incidencia())
                .tendenciaTrimestral(repository.tendencia())
                .alertas(List.of())
                .build();
    }
}