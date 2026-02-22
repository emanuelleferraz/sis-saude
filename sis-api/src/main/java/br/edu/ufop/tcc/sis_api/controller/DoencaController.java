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

import br.edu.ufop.tcc.sis_api.model.dto.doenca.DoencaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.doenca.DoencaResponseDTO;
import br.edu.ufop.tcc.sis_api.service.DoencaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/doencas")
@RequiredArgsConstructor
public class DoencaController {

    private final DoencaService doencaService;

    @PostMapping
    public ResponseEntity<DoencaResponseDTO> criar(@RequestBody DoencaRequestDTO dto) {
        return ResponseEntity.ok(doencaService.salvar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoencaResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody DoencaRequestDTO dto) {

        return ResponseEntity.ok(doencaService.atualizar(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<DoencaResponseDTO>> listar() {
        return ResponseEntity.ok(doencaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoencaResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(doencaService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        doencaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}