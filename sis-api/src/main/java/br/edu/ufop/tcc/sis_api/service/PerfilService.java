package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.usuarios.PerfilRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.usuarios.PerfilResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.PerfilEntity;
import br.edu.ufop.tcc.sis_api.repository.PerfilRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final PerfilRepository repository;

    public PerfilResponseDTO salvar(PerfilRequestDTO dto) {

        PerfilEntity perfil = PerfilEntity.builder()
                .nome(dto.getNome())
                .build();

        repository.save(perfil);

        return converterParaResponse(perfil);
    }

    public List<PerfilResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public PerfilResponseDTO buscarPorId(Integer id) {
        PerfilEntity perfil = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado"));

        return converterParaResponse(perfil);
    }

    public PerfilResponseDTO atualizar(Integer id, PerfilRequestDTO dto) {

        PerfilEntity perfil = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado"));

        perfil.setNome(dto.getNome());

        repository.save(perfil);

        return converterParaResponse(perfil);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }

    private PerfilResponseDTO converterParaResponse(PerfilEntity perfil) {
        return PerfilResponseDTO.builder()
                .id(perfil.getId())
                .nome(perfil.getNome())
                .build();
    }
}