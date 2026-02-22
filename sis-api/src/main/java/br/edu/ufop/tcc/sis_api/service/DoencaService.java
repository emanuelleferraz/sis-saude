package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.doenca.DoencaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.doenca.DoencaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.DoencaEntity;
import br.edu.ufop.tcc.sis_api.repository.DoencaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoencaService {

    private final DoencaRepository doencaRepository;

    public DoencaResponseDTO salvar(DoencaRequestDTO dto) {

        DoencaEntity doenca = DoencaEntity.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .build();

        doencaRepository.save(doenca);
        return converter(doenca);
    }

    public DoencaResponseDTO atualizar(Integer id, DoencaRequestDTO dto) {

        DoencaEntity doenca = doencaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doença não encontrada"));

        doenca.setNome(dto.getNome());
        doenca.setDescricao(dto.getDescricao());

        doencaRepository.save(doenca);
        return converter(doenca);
    }

    public List<DoencaResponseDTO> listarTodas() {
        return doencaRepository.findAll()
                .stream()
                .map(this::converter)
                .toList();
    }

    public DoencaResponseDTO buscarPorId(Integer id) {
        DoencaEntity doenca = doencaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doença não encontrada"));

        return converter(doenca);
    }

    public void deletar(Integer id) {
        if (!doencaRepository.existsById(id)) {
            throw new RuntimeException("Doença não encontrada");
        }
        doencaRepository.deleteById(id);
    }

    private DoencaResponseDTO converter(DoencaEntity doenca) {
        return DoencaResponseDTO.builder()
                .id(doenca.getId())
                .nome(doenca.getNome())
                .descricao(doenca.getDescricao())
                .build();
    }
}