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

import br.edu.ufop.tcc.sis_api.model.dto.paciente.PacienteRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.paciente.PacienteResponseDTO;
import br.edu.ufop.tcc.sis_api.service.PacienteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;

    @PostMapping
    public PacienteResponseDTO criar(@RequestBody PacienteRequestDTO dto) {
        return service.salvar(dto);
    }

    @GetMapping
    public List<PacienteResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PacienteResponseDTO buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public PacienteResponseDTO atualizar(@PathVariable Integer id,
                                         @RequestBody PacienteRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }
}