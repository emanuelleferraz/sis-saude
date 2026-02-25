package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VisitaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VisitaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.AgenteSaudeEntity;
import br.edu.ufop.tcc.sis_api.model.entity.PacienteEntity;
import br.edu.ufop.tcc.sis_api.model.entity.VisitaEntity;
import br.edu.ufop.tcc.sis_api.repository.AgenteSaudeRepository;
import br.edu.ufop.tcc.sis_api.repository.PacienteRepository;
import br.edu.ufop.tcc.sis_api.repository.VisitaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VisitaService {

    private final VisitaRepository visitaRepository;
    private final PacienteRepository pacienteRepository;
    private final AgenteSaudeRepository agenteRepository;

    public VisitaResponseDTO salvar(VisitaRequestDTO dto) {

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        AgenteSaudeEntity agente = agenteRepository.findById(dto.getAgenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));

        VisitaEntity visita = VisitaEntity.builder()
                .dataVisita(dto.getDataVisita())
                .observacoes(dto.getObservacoes())
                .paciente(paciente)
                .agente(agente)
                .build();

        visitaRepository.save(visita);
        return converter(visita);
    }

    public List<VisitaResponseDTO> listarTodas() {
        return visitaRepository.findAll()
                .stream()
                .map(this::converter)
                .toList();
    }

    public VisitaResponseDTO buscarPorId(Integer id) {

        VisitaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita não encontrada"));

        return converter(visita);
    }


    public VisitaResponseDTO atualizar(Integer id, VisitaRequestDTO dto) {

        VisitaEntity visita = visitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visita não encontrada"));

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        AgenteSaudeEntity agente = agenteRepository.findById(dto.getAgenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));

        visita.setDataVisita(dto.getDataVisita());
        visita.setObservacoes(dto.getObservacoes());
        visita.setPaciente(paciente);
        visita.setAgente(agente);

        visitaRepository.save(visita);

        return converter(visita);
    }

    public void deletar(Integer id) {
        if (!visitaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Visita não encontrada");
        }
        visitaRepository.deleteById(id);
    }

    private VisitaResponseDTO converter(VisitaEntity visita) {
        return VisitaResponseDTO.builder()
                .id(visita.getId())
                .dataVisita(visita.getDataVisita())
                .observacoes(visita.getObservacoes())
                .nomePaciente(visita.getPaciente().getNome())
                .nomeAgente(visita.getAgente().getNome())
                .build();
    }
}