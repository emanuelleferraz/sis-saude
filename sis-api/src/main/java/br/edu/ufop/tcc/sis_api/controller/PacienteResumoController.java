package br.edu.ufop.tcc.sis_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufop.tcc.sis_api.model.dto.paciente.PacienteResumoResponseDTO;
import br.edu.ufop.tcc.sis_api.service.PacienteResumoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
public class PacienteResumoController {

    private final PacienteResumoService resumoService;

    @GetMapping("/{id}/resumo")
    public ResponseEntity<PacienteResumoResponseDTO> resumo(@PathVariable Integer id) {
        return ResponseEntity.ok(resumoService.gerarResumo(id));
    }
}
