package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.EmailAlreadyExistsException;
import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.usuarios.UsuarioRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.usuarios.UsuarioResponseDTO;
import br.edu.ufop.tcc.sis_api.model.dto.usuarios.UsuarioUpdateDTO;
import br.edu.ufop.tcc.sis_api.model.entity.PerfilEntity;
import br.edu.ufop.tcc.sis_api.model.entity.UsuarioEntity;
import br.edu.ufop.tcc.sis_api.repository.PerfilRepository;
import br.edu.ufop.tcc.sis_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PerfilRepository perfilRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioResponseDTO salvar(UsuarioRequestDTO dto) {

        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(dto.getEmail());
       }

        PerfilEntity perfil = perfilRepository.findById(dto.getPerfilId())
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado"));

        UsuarioEntity usuario = UsuarioEntity.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senhaHash(passwordEncoder.encode(dto.getSenha()))
                .perfil(perfil)
                .build();

        repository.save(usuario);

        return converterParaResponse(usuario);
    }

    public List<UsuarioResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public UsuarioResponseDTO buscarPorId(Integer id) {
        UsuarioEntity usuario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return converterParaResponse(usuario);
    }

    public UsuarioResponseDTO atualizar(Integer id, UsuarioUpdateDTO dto) {

        UsuarioEntity usuario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        PerfilEntity perfil = perfilRepository.findById(dto.getPerfilId())
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setPerfil(perfil);

        repository.save(usuario);

        return converterParaResponse(usuario);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }

    private UsuarioResponseDTO converterParaResponse(UsuarioEntity usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfilNome(usuario.getPerfil().getNome())
                .build();
    }
}