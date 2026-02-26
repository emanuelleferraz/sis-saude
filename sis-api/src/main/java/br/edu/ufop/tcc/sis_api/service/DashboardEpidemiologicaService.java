package br.edu.ufop.tcc.sis_api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.epidemiologica.DashboardEpidemiologicaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.AlertaBairroDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.IncidenciaPorBairroDTO;
import br.edu.ufop.tcc.sis_api.repository.DashboardEpidemiologicaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardEpidemiologicaService {

    private final DashboardEpidemiologicaRepository repository;

    public DashboardEpidemiologicaDTO getDashboard() {

        LocalDate dataLimite = LocalDate.now().minusDays(90);
        LocalDateTime dataLimiteDateTime = dataLimite.atStartOfDay();

        List<IncidenciaPorBairroDTO> incidencias = repository.incidencia();

        return DashboardEpidemiologicaDTO.builder()
                .resumo(repository.buscarResumo(dataLimiteDateTime))
                .distribuicao(repository.distribuicao())
                .incidenciaPorBairro(incidencias)
                .tendenciaTrimestral(repository.tendencia())
                .alertas(calcularAlertas(incidencias)) 
                .build();
    }

    public List<AlertaBairroDTO> calcularAlertas(List<IncidenciaPorBairroDTO> incidencias) {
        List<AlertaBairroDTO> alertas = new ArrayList<>();

        for (IncidenciaPorBairroDTO dto : incidencias) {
            String nivelAlerta;
            long totalCasos = dto.getTotalCasos();

            if (totalCasos <= 10) {
                nivelAlerta = "Normal";
            } else if (totalCasos <= 30) {
                nivelAlerta = "Atenção";
            } else {
                nivelAlerta = "Crítico";
            }

            alertas.add(AlertaBairroDTO.builder()
                    .bairro(dto.getBairro())
                    .doenca(dto.getDoenca())
                    .totalCasos(totalCasos)
                    .nivelAlerta(nivelAlerta)
                    .build());
        }

        return alertas;
    }
}