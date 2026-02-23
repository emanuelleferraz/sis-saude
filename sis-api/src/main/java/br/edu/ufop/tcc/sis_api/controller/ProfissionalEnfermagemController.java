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

import br.edu.ufop.tcc.sis_api.model.dto.profissionais.ProfissionalEnfermagemRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.ProfissionalEnfermagemResponseDTO;
import br.edu.ufop.tcc.sis_api.service.ProfissionalEnfermagemService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/enfermeiros")
@RequiredArgsConstructor
public class ProfissionalEnfermagemController {

    private final ProfissionalEnfermagemService service;

    @PostMapping
    public ResponseEntity<ProfissionalEnfermagemResponseDTO> criar(@RequestBody ProfissionalEnfermagemRequestDTO dto) {
        return ResponseEntity.ok(service.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalEnfermagemResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalEnfermagemResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfissionalEnfermagemResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody ProfissionalEnfermagemRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}