package br.edu.ufop.tcc.sis_api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import br.edu.ufop.tcc.sis_api.model.dto.indicadores.AplicacaoVacinaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.AplicacaoVacinaResponseDTO;
import br.edu.ufop.tcc.sis_api.service.AplicacaoVacinaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/aplicacoes-vacina")
@RequiredArgsConstructor
public class AplicacaoVacinaController {

    private final AplicacaoVacinaService aplicacaoService;

    @PostMapping
    public ResponseEntity<AplicacaoVacinaResponseDTO> criar(
            @RequestBody AplicacaoVacinaRequestDTO dto) {

        return ResponseEntity.ok(aplicacaoService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<AplicacaoVacinaResponseDTO>> listar() {
        return ResponseEntity.ok(aplicacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AplicacaoVacinaResponseDTO> buscar(
            @PathVariable Integer id) {

        return ResponseEntity.ok(aplicacaoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AplicacaoVacinaResponseDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody AplicacaoVacinaRequestDTO dto) {

        return ResponseEntity.ok(aplicacaoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        aplicacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
