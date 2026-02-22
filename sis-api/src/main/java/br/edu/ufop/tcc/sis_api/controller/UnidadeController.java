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

import br.edu.ufop.tcc.sis_api.model.dto.unidade.UnidadeRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.unidade.UnidadeResponseDTO;
import br.edu.ufop.tcc.sis_api.service.UnidadeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/unidades")
@RequiredArgsConstructor
public class UnidadeController {

    private final UnidadeService unidadeService;

    @PostMapping
    public ResponseEntity<UnidadeResponseDTO> salvar(@RequestBody UnidadeRequestDTO dto) {
        return ResponseEntity.ok(unidadeService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<UnidadeResponseDTO>> listarTodas() {
        return ResponseEntity.ok(unidadeService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadeResponseDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(unidadeService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnidadeResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody UnidadeRequestDTO dto) {

        return ResponseEntity.ok(unidadeService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        unidadeService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
