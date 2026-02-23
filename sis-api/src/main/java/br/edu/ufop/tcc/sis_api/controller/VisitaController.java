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

import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VisitaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VisitaResponseDTO;
import br.edu.ufop.tcc.sis_api.service.VisitaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/visitas")
@RequiredArgsConstructor
public class VisitaController {

    private final VisitaService service;

    @PostMapping
    public ResponseEntity<VisitaResponseDTO> criar(@RequestBody VisitaRequestDTO dto) {
        return ResponseEntity.ok(service.salvar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisitaResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody VisitaRequestDTO dto) {

        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<VisitaResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitaResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
