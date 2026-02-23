package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.unidade.UnidadeRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.unidade.UnidadeResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.EnderecoEntity;
import br.edu.ufop.tcc.sis_api.model.entity.UnidadePsfEntity;
import br.edu.ufop.tcc.sis_api.repository.EnderecoRepository;
import br.edu.ufop.tcc.sis_api.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;
    private final EnderecoRepository enderecoRepository;

    public UnidadeResponseDTO salvar(UnidadeRequestDTO dto) {

        EnderecoEntity endereco = enderecoRepository.findById(dto.getEnderecoId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado"));

        UnidadePsfEntity unidade = UnidadePsfEntity.builder()
                .nome(dto.getNome())
                .telefone(dto.getTelefone())
                .endereco(endereco)
                .build();

        unidadeRepository.save(unidade);

        return converter(unidade);
    }

    public UnidadeResponseDTO atualizar(Integer id, UnidadeRequestDTO dto) {

        UnidadePsfEntity unidade = unidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        EnderecoEntity endereco = enderecoRepository.findById(dto.getEnderecoId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado"));

        unidade.setNome(dto.getNome());
        unidade.setTelefone(dto.getTelefone());
        unidade.setEndereco(endereco);

        unidadeRepository.save(unidade);

        return converter(unidade);
    }

    public List<UnidadeResponseDTO> listarTodas() {
        return unidadeRepository.findAll()
                .stream()
                .map(this::converter)
                .toList();
    }

    public UnidadeResponseDTO buscarPorId(Integer id) {

        UnidadePsfEntity unidade = unidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        return converter(unidade);
    }

    public void deletar(Integer id) {
        if (!unidadeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Unidade não encontrada");
        }
        unidadeRepository.deleteById(id);
    }

    private UnidadeResponseDTO converter(UnidadePsfEntity unidade) {

        EnderecoEntity end = unidade.getEndereco();

        String enderecoFormatado = end.getRua() + ", "
                + end.getNumero() + " - "
                + end.getBairro().getNome();

        return UnidadeResponseDTO.builder()
                .id(unidade.getId())
                .nome(unidade.getNome())
                .telefone(unidade.getTelefone())
                .enderecoId(end.getId())
                .enderecoFormatado(enderecoFormatado)
                .build();
    }
}