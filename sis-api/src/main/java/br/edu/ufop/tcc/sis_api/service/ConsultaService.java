package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.ConsultaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.ConsultaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.ConsultaEntity;
import br.edu.ufop.tcc.sis_api.model.entity.DoencaEntity;
import br.edu.ufop.tcc.sis_api.model.entity.MedicoEntity;
import br.edu.ufop.tcc.sis_api.model.entity.PacienteEntity;
import br.edu.ufop.tcc.sis_api.model.entity.UnidadePsfEntity;
import br.edu.ufop.tcc.sis_api.repository.ConsultaRepository;
import br.edu.ufop.tcc.sis_api.repository.DoencaRepository;
import br.edu.ufop.tcc.sis_api.repository.MedicoRepository;
import br.edu.ufop.tcc.sis_api.repository.PacienteRepository;
import br.edu.ufop.tcc.sis_api.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final UnidadeRepository unidadeRepository;
    private final DoencaRepository doencaRepository;

    public ConsultaResponseDTO salvar(ConsultaRequestDTO dto) {

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        MedicoEntity medico = medicoRepository.findById(dto.getMedicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Médico não encontrado"));

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        DoencaEntity doenca = doencaRepository.findById(dto.getDoencaId())
                .orElseThrow(() -> new ResourceNotFoundException("Doença não encontrada"));

        ConsultaEntity consulta = ConsultaEntity.builder()
                .dataConsulta(dto.getDataConsulta())
                .observacoes(dto.getObservacoes())
                .paciente(paciente)
                .medico(medico)
                .unidade(unidade)
                .doenca(doenca)
                .build();

        consultaRepository.save(consulta);

        return converterParaResponse(consulta);
    }

    public List<ConsultaResponseDTO> listarTodas() {
        return consultaRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public ConsultaResponseDTO buscarPorId(Integer id) {
        ConsultaEntity consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta não encontrada"));

        return converterParaResponse(consulta);
    }

    public ConsultaResponseDTO atualizar(Integer id, ConsultaRequestDTO dto) {

        ConsultaEntity consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta não encontrada"));

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        MedicoEntity medico = medicoRepository.findById(dto.getMedicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Médico não encontrado"));

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada"));

        DoencaEntity doenca = doencaRepository.findById(dto.getDoencaId())
                .orElseThrow(() -> new ResourceNotFoundException("Doença não encontrada"));

        consulta.setDataConsulta(dto.getDataConsulta());
        consulta.setObservacoes(dto.getObservacoes());
        consulta.setPaciente(paciente);
        consulta.setMedico(medico);
        consulta.setUnidade(unidade);
        consulta.setDoenca(doenca);

        consultaRepository.save(consulta);

        return converterParaResponse(consulta);
    }

    public void deletar(Integer id) {
        if (!consultaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Consulta não encontrada");
        }
        consultaRepository.deleteById(id);
    }

    private ConsultaResponseDTO converterParaResponse(ConsultaEntity consulta) {

        DoencaEntity doenca = consulta.getDoenca();

        return ConsultaResponseDTO.builder()
                .id(consulta.getId())
                .dataConsulta(consulta.getDataConsulta())
                .observacoes(consulta.getObservacoes())
                .pacienteNome(consulta.getPaciente().getNome())
                .medicoNome(consulta.getMedico().getNome())
                .unidadeNome(consulta.getUnidade().getNome())
                .doencaNome(doenca.getNome())
                .build();
    }
}
