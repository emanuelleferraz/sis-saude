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

import br.edu.ufop.tcc.sis_api.model.dto.profissionais.AgenteSaudeRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.AgenteSaudeResponseDTO;
import br.edu.ufop.tcc.sis_api.service.AgenteSaudeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/agentes")
@RequiredArgsConstructor
public class AgenteSaudeController {

    private final AgenteSaudeService service;

    @PostMapping
    public ResponseEntity<AgenteSaudeResponseDTO> criar(@RequestBody AgenteSaudeRequestDTO dto) {
        return ResponseEntity.ok(service.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<AgenteSaudeResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgenteSaudeResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgenteSaudeResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody AgenteSaudeRequestDTO dto) {

        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}