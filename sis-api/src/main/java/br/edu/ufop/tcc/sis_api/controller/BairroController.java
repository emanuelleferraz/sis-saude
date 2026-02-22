package br.edu.ufop.tcc.sis_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufop.tcc.sis_api.model.dto.territoriais.BairroRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.territoriais.BairroResponseDTO;
import br.edu.ufop.tcc.sis_api.service.BairroService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bairros")
@RequiredArgsConstructor
public class BairroController {

    private final BairroService service;

    @PostMapping
    public BairroResponseDTO criar(@RequestBody BairroRequestDTO dto) {
        return service.salvar(dto);
    }

    @GetMapping
    public List<BairroResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public BairroResponseDTO buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public BairroResponseDTO atualizar(@PathVariable Integer id,
                                       @RequestBody BairroRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }
}