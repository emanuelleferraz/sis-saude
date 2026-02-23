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

import br.edu.ufop.tcc.sis_api.model.dto.usuarios.PerfilRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.usuarios.PerfilResponseDTO;
import br.edu.ufop.tcc.sis_api.service.PerfilService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/perfis")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService service;

    @PostMapping
    public PerfilResponseDTO criar(@RequestBody PerfilRequestDTO dto) {
        return service.salvar(dto);
    }

    @GetMapping
    public List<PerfilResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PerfilResponseDTO buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public PerfilResponseDTO atualizar(@PathVariable Integer id,
                                       @RequestBody PerfilRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }
}