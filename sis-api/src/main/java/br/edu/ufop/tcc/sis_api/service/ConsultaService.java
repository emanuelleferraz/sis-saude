package br.edu.ufop.tcc.sis_api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.doenca.DoencaResumoDTO;
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
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        MedicoEntity medico = medicoRepository.findById(dto.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        List<DoencaEntity> doencas = doencaRepository.findAllById(dto.getDoencasIds());

        ConsultaEntity consulta = ConsultaEntity.builder()
                .dataConsulta(LocalDateTime.parse(dto.getDataConsulta()))
                .observacoes(dto.getObservacoes())
                .paciente(paciente)
                .medico(medico)
                .unidade(unidade)
                .doencas(doencas)
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
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        return converterParaResponse(consulta);
    }

    public ConsultaResponseDTO atualizar(Integer id, ConsultaRequestDTO dto) {

        ConsultaEntity consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        MedicoEntity medico = medicoRepository.findById(dto.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        UnidadePsfEntity unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        List<DoencaEntity> doencas = doencaRepository.findAllById(dto.getDoencasIds());

        consulta.setDataConsulta(LocalDateTime.parse(dto.getDataConsulta()));
        consulta.setObservacoes(dto.getObservacoes());
        consulta.setPaciente(paciente);
        consulta.setMedico(medico);
        consulta.setUnidade(unidade);
        consulta.setDoencas(doencas);

        consultaRepository.save(consulta);

        return converterParaResponse(consulta);
    }

    public void deletar(Integer id) {
        if (!consultaRepository.existsById(id)) {
            throw new RuntimeException("Consulta não encontrada");
        }
        consultaRepository.deleteById(id);
    }

    private ConsultaResponseDTO converterParaResponse(ConsultaEntity consulta) {

        List<DoencaResumoDTO> doencas = consulta.getDoencas()
                .stream()
                .map(d -> DoencaResumoDTO.builder()
                        .id(d.getId())
                        .nome(d.getNome())
                        .build())
                .toList();

        return ConsultaResponseDTO.builder()
                .id(consulta.getId())
                .dataConsulta(consulta.getDataConsulta().toString())
                .observacoes(consulta.getObservacoes())
                .pacienteId(consulta.getPaciente().getId())
                .pacienteNome(consulta.getPaciente().getNome())
                .medicoId(consulta.getMedico().getId())
                .medicoNome(consulta.getMedico().getNome())
                .unidadeId(consulta.getUnidade().getId())
                .unidadeNome(consulta.getUnidade().getNome())
                .doencas(doencas)
                .build();
    }
}
