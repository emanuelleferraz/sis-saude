package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.AplicacaoVacinaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.ConsultaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VisitaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.dto.paciente.PacienteResumoResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.EnderecoEntity;
import br.edu.ufop.tcc.sis_api.model.entity.PacienteEntity;
import br.edu.ufop.tcc.sis_api.repository.AplicacaoVacinaRepository;
import br.edu.ufop.tcc.sis_api.repository.ConsultaRepository;
import br.edu.ufop.tcc.sis_api.repository.PacienteRepository;
import br.edu.ufop.tcc.sis_api.repository.VisitaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteResumoService {

    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;
    private final AplicacaoVacinaRepository aplicacaoRepository;
    private final VisitaRepository visitaRepository;

    public PacienteResumoResponseDTO gerarResumo(Integer pacienteId) {

        PacienteEntity paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        List<ConsultaResponseDTO> consultas = consultaRepository
                .findByPacienteId(pacienteId)
                .stream()
                .map(c -> ConsultaResponseDTO.builder()
                        .id(c.getId())
                        .dataConsulta(c.getDataConsulta())
                        .observacoes(c.getObservacoes())
                        .pacienteNome(c.getPaciente().getNome())
                        .medicoNome(c.getMedico().getNome())
                        .unidadeNome(c.getUnidade().getNome())
                        .doencaNome(c.getDoenca().getNome())
                        .build()
                ).toList();

        List<AplicacaoVacinaResponseDTO> vacinas = aplicacaoRepository
                .findByPacienteId(pacienteId)
                .stream()
                .map(v -> AplicacaoVacinaResponseDTO.builder()
                        .id(v.getId())
                        .dataAplicacao(v.getDataAplicacao())
                        .dose(v.getDose())
                        .nomePaciente(v.getPaciente().getNome())
                        .nomeVacina(v.getVacina().getNome())
                        .nomeEnfermeiro(v.getEnfermeiro().getNome())
                        .nomeUnidade(v.getUnidade().getNome())
                        .build()
                ).toList();

        List<VisitaResponseDTO> visitas = visitaRepository
                .findByPacienteId(pacienteId)
                .stream()
                .map(v -> VisitaResponseDTO.builder()
                        .id(v.getId())
                        .dataVisita(v.getDataVisita())
                        .observacoes(v.getObservacoes())
                        .nomePaciente(v.getPaciente().getNome())
                        .nomeAgente(v.getAgente().getNome())
                        .build()
                ).toList();

        EnderecoEntity end = paciente.getEndereco();        
        String enderecoFormatado = end.getRua() + ", "
                + end.getNumero() + " - "
                + end.getBairro().getNome();

        return PacienteResumoResponseDTO.builder()
                .id(paciente.getId())
                .nome(paciente.getNome())
                .cpf(paciente.getCpf())
                .dataNascimento(paciente.getDataNascimento())
                .sexo(paciente.getSexo())
                .enderecoFormatado(enderecoFormatado)
                .telefone(paciente.getTelefone())
                .consultas(consultas)
                .vacinas(vacinas)
                .visitas(visitas)
                .build();
    }
}
