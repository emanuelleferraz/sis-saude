package br.edu.ufop.tcc.sis_api.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.paciente.PacienteRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.paciente.PacienteResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.EnderecoEntity;
import br.edu.ufop.tcc.sis_api.model.entity.PacienteEntity;
import br.edu.ufop.tcc.sis_api.repository.EnderecoRepository;
import br.edu.ufop.tcc.sis_api.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository repository;
    private final EnderecoRepository enderecoRepository;

    public PacienteResponseDTO salvar(PacienteRequestDTO dto) {

        EnderecoEntity endereco = enderecoRepository.findById(dto.getIdEndereco())
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        PacienteEntity paciente = PacienteEntity.builder()
                .nome(dto.getNome())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .dataNascimento(LocalDate.parse(dto.getDataNascimento()))
                .endereco(endereco)
                .build();

        repository.save(paciente);

        return converterParaResponse(paciente);
    }

    public List<PacienteResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public PacienteResponseDTO buscarPorId(Integer id) {
        PacienteEntity paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        return converterParaResponse(paciente);
    }

    public PacienteResponseDTO atualizar(Integer id, PacienteRequestDTO dto) {

        PacienteEntity paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        EnderecoEntity endereco = enderecoRepository.findById(dto.getIdEndereco())
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setTelefone(dto.getTelefone());
        paciente.setDataNascimento(LocalDate.parse(dto.getDataNascimento()));
        paciente.setEndereco(endereco);

        repository.save(paciente);

        return converterParaResponse(paciente);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }

    private PacienteResponseDTO converterParaResponse(PacienteEntity paciente) {
        return PacienteResponseDTO.builder()
                .id(paciente.getId())
                .nome(paciente.getNome())
                .cpf(paciente.getCpf())
                .telefone(paciente.getTelefone())
                .dataNascimento(paciente.getDataNascimento().toString())
                .cidade(paciente.getEndereco().getCidade())
                .bairro(paciente.getEndereco().getBairro().getNome())
                .build();
    }
}