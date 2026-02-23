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

import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VacinaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VacinaResponseDTO;
import br.edu.ufop.tcc.sis_api.service.VacinaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vacinas")
@RequiredArgsConstructor
public class VacinaController {

    private final VacinaService vacinaService;

    @PostMapping
    public ResponseEntity<VacinaResponseDTO> criar(@RequestBody VacinaRequestDTO dto) {
        return ResponseEntity.ok(vacinaService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<VacinaResponseDTO>> listar() {
        return ResponseEntity.ok(vacinaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacinaResponseDTO> buscar(@PathVariable Integer id) {
        return ResponseEntity.ok(vacinaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacinaResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody VacinaRequestDTO dto) {

        return ResponseEntity.ok(vacinaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        vacinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
