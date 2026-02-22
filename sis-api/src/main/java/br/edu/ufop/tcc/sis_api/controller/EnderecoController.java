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

import br.edu.ufop.tcc.sis_api.model.dto.territoriais.EnderecoRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.territoriais.EnderecoResponseDTO;
import br.edu.ufop.tcc.sis_api.service.EnderecoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/enderecos")
@RequiredArgsConstructor
public class EnderecoController {

    private final EnderecoService service;

    @PostMapping
    public EnderecoResponseDTO criar(@RequestBody EnderecoRequestDTO dto) {
        return service.salvar(dto);
    }

    @GetMapping
    public List<EnderecoResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public EnderecoResponseDTO buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public EnderecoResponseDTO atualizar(@PathVariable Integer id,
                                         @RequestBody EnderecoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }
}