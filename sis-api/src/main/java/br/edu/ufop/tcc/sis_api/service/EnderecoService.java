package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.territoriais.EnderecoRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.territoriais.EnderecoResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.BairroEntity;
import br.edu.ufop.tcc.sis_api.model.entity.EnderecoEntity;
import br.edu.ufop.tcc.sis_api.repository.BairroRepository;
import br.edu.ufop.tcc.sis_api.repository.EnderecoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository repository;
    private final BairroRepository bairroRepository;

    public EnderecoResponseDTO salvar(EnderecoRequestDTO dto) {

        BairroEntity bairro = bairroRepository.findById(dto.getIdBairro())
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado"));

        EnderecoEntity endereco = EnderecoEntity.builder()
                .rua(dto.getRua())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .cep(dto.getCep())
                .cidade(dto.getCidade())
                .bairro(bairro)
                .build();

        repository.save(endereco);

        return converterParaResponse(endereco);
    }

    public List<EnderecoResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public EnderecoResponseDTO buscarPorId(Integer id) {
        EnderecoEntity endereco = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado"));

        return converterParaResponse(endereco);
    }

    public EnderecoResponseDTO atualizar(Integer id, EnderecoRequestDTO dto) {

        EnderecoEntity endereco = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado"));

        BairroEntity bairro = bairroRepository.findById(dto.getIdBairro())
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado"));

        endereco.setRua(dto.getRua());
        endereco.setNumero(dto.getNumero());
        endereco.setComplemento(dto.getComplemento());
        endereco.setCep(dto.getCep());
        endereco.setCidade(dto.getCidade());
        endereco.setBairro(bairro);

        repository.save(endereco);

        return converterParaResponse(endereco);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }

    private EnderecoResponseDTO converterParaResponse(EnderecoEntity endereco) {
        return EnderecoResponseDTO.builder()
                .id(endereco.getId())
                .rua(endereco.getRua())
                .numero(endereco.getNumero())
                .complemento(endereco.getComplemento())
                .cep(endereco.getCep())
                .cidade(endereco.getCidade())
                .bairroNome(endereco.getBairro().getNome())
                .build();
    }
}