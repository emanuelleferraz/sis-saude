package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.AgenteSaudeRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.AgenteSaudeResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.AgenteSaudeEntity;
import br.edu.ufop.tcc.sis_api.model.entity.BairroEntity;
import br.edu.ufop.tcc.sis_api.model.entity.UnidadePsfEntity;
import br.edu.ufop.tcc.sis_api.repository.AgenteSaudeRepository;
import br.edu.ufop.tcc.sis_api.repository.BairroRepository;
import br.edu.ufop.tcc.sis_api.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AgenteSaudeService {

    private final AgenteSaudeRepository agenteRepository;
    private final UnidadeRepository unidadeRepository;
    private final BairroRepository bairroRepository;

    public AgenteSaudeResponseDTO salvar(AgenteSaudeRequestDTO dto) {

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        BairroEntity bairro = bairroRepository.findById(dto.getBairroId())
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado"));

        AgenteSaudeEntity agente = AgenteSaudeEntity.builder()
                .nome(dto.getNome())
                .telefone(dto.getTelefone())
                .unidade(unidade)
                .bairro(bairro)
                .build();

        agenteRepository.save(agente);
        return converter(agente);
    }

    public List<AgenteSaudeResponseDTO> listarTodos() {
        return agenteRepository.findAll()
                .stream()
                .map(this::converter)
                .toList();
    }

    public AgenteSaudeResponseDTO buscarPorId(Integer id) {
        AgenteSaudeEntity agente = agenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));
        return converter(agente);
    }

    public AgenteSaudeResponseDTO atualizar(Integer id, AgenteSaudeRequestDTO dto) {

        AgenteSaudeEntity agente = agenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        BairroEntity bairro = bairroRepository.findById(dto.getBairroId())
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado"));

        agente.setNome(dto.getNome());
        agente.setTelefone(dto.getTelefone());
        agente.setUnidade(unidade);
        agente.setBairro(bairro);

        agenteRepository.save(agente);

        return converter(agente);
    }

    public void deletar(Integer id) {
        if (!agenteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Agente não encontrado");
        }
        agenteRepository.deleteById(id);
    }

    private AgenteSaudeResponseDTO converter(AgenteSaudeEntity agente) {
        return AgenteSaudeResponseDTO.builder()
                .id(agente.getId())
                .nome(agente.getNome())
                .telefone(agente.getTelefone())
                .nomeUnidade(agente.getUnidade().getNome())
                .nomeBairro(agente.getBairro().getNome())
                .build();
    }
}