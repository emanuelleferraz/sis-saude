package br.edu.ufop.tcc.sis_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.DashboardVacinaDTO;
import br.edu.ufop.tcc.sis_api.service.DashboardVacinaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard/vacinas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardVacinaController {

    private final DashboardVacinaService service;

    @GetMapping
    public ResponseEntity<DashboardVacinaDTO> obterDashboard() {
        return ResponseEntity.ok(service.obterDashboard());
    }
}