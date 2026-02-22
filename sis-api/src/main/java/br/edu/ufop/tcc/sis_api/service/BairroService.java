package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.territoriais.BairroRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.territoriais.BairroResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.BairroEntity;
import br.edu.ufop.tcc.sis_api.repository.BairroRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BairroService {

    private final BairroRepository repository;

    public BairroResponseDTO salvar(BairroRequestDTO dto) {

        BairroEntity bairro = BairroEntity.builder()
                .nome(dto.getNome())
                .build();

        repository.save(bairro);

        return converterParaResponse(bairro);
    }

    public List<BairroResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public BairroResponseDTO buscarPorId(Integer id) {
        BairroEntity bairro = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bairro não encontrado"));

        return converterParaResponse(bairro);
    }

    public BairroResponseDTO atualizar(Integer id, BairroRequestDTO dto) {

        BairroEntity bairro = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bairro não encontrado"));

        bairro.setNome(dto.getNome());

        repository.save(bairro);

        return converterParaResponse(bairro);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }

    private BairroResponseDTO converterParaResponse(BairroEntity bairro) {
        return BairroResponseDTO.builder()
                .id(bairro.getId())
                .nome(bairro.getNome())
                .build();
    }
}