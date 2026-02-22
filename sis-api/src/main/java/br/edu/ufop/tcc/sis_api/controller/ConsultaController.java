package br.edu.ufop.tcc.sis_api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufop.tcc.sis_api.model.dto.indicadores.ConsultaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.ConsultaResponseDTO;
import br.edu.ufop.tcc.sis_api.service.ConsultaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @PostMapping
    public ResponseEntity<ConsultaResponseDTO> criar(@RequestBody ConsultaRequestDTO dto) {
        return ResponseEntity.ok(consultaService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ConsultaResponseDTO>> listar() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(consultaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody ConsultaRequestDTO dto) {

        return ResponseEntity.ok(consultaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        consultaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
