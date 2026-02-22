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

import br.edu.ufop.tcc.sis_api.model.dto.profissionais.MedicoRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.MedicoResponseDTO;
import br.edu.ufop.tcc.sis_api.service.MedicoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/medicos")
@RequiredArgsConstructor
public class MedicoController {

    private final MedicoService medicoService;

    @PostMapping
    public ResponseEntity<MedicoResponseDTO> criar(@RequestBody MedicoRequestDTO dto) {
        return ResponseEntity.ok(medicoService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<MedicoResponseDTO>> listar() {
        return ResponseEntity.ok(medicoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(medicoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicoResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody MedicoRequestDTO dto) {

        return ResponseEntity.ok(medicoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        medicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
