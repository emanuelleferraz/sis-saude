package br.edu.ufop.tcc.sis_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.cronica.DashboardCronicaDTO;
import br.edu.ufop.tcc.sis_api.service.DashboardCronicaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard/cronicas")
@RequiredArgsConstructor
public class DashboardCronicaController {

    private final DashboardCronicaService service;

    @GetMapping
    public DashboardCronicaDTO dashboard() {
        return service.getDashboard();
    }
}
