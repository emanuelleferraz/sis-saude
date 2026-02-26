package br.edu.ufop.tcc.sis_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.epidemiologica.DashboardEpidemiologicaDTO;
import br.edu.ufop.tcc.sis_api.service.DashboardEpidemiologicaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard/epidemiologicas")
@RequiredArgsConstructor
public class DashboardEpidemiologicaController {

    private final DashboardEpidemiologicaService service;

    @GetMapping
    public DashboardEpidemiologicaDTO dashboard() {
        return service.getDashboard();
    }
}
