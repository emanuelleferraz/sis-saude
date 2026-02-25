package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.ProfissionalEnfermagemRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.ProfissionalEnfermagemResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.ProfissionalEnfermagemEntity;
import br.edu.ufop.tcc.sis_api.model.entity.UnidadePsfEntity;
import br.edu.ufop.tcc.sis_api.repository.ProfissionalEnfermagemRepository;
import br.edu.ufop.tcc.sis_api.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfissionalEnfermagemService {

    private final ProfissionalEnfermagemRepository repository;
    private final UnidadeRepository unidadeRepository;

    public ProfissionalEnfermagemResponseDTO salvar(ProfissionalEnfermagemRequestDTO dto) {

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        ProfissionalEnfermagemEntity entity = ProfissionalEnfermagemEntity.builder()
                .nome(dto.getNome())
                .coren(dto.getCoren())
                .telefone(dto.getTelefone())
                .tipo(dto.getTipo())
                .unidade(unidade)
                .build();

        repository.save(entity);
        return converter(entity);
    }

    public List<ProfissionalEnfermagemResponseDTO> listarTodos() {
        return repository.findAll().stream().map(this::converter).toList();
    }

    public ProfissionalEnfermagemResponseDTO buscarPorId(Integer id) {
        return converter(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enfermeiro não encontrado")));
    }

    public ProfissionalEnfermagemResponseDTO atualizar(Integer id, ProfissionalEnfermagemRequestDTO dto) {

        ProfissionalEnfermagemEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enfermeiro não encontrado"));

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        entity.setNome(dto.getNome());
        entity.setCoren(dto.getCoren());
        entity.setTelefone(dto.getTelefone());
        entity.setTipo(dto.getTipo());
        entity.setUnidade(unidade);

        repository.save(entity);

        return converter(entity);
    }

    public void deletar(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Enfermeiro não encontrado");
        }
        repository.deleteById(id);
    }

    private ProfissionalEnfermagemResponseDTO converter(ProfissionalEnfermagemEntity e) {
        return ProfissionalEnfermagemResponseDTO.builder()
                .id(e.getId())
                .nome(e.getNome())
                .coren(e.getCoren())
                .telefone(e.getTelefone())
                .tipo(e.getTipo())
                .unidadeId(e.getUnidade().getId())
                .nomeUnidade(e.getUnidade().getNome())
                .build();
    }
}