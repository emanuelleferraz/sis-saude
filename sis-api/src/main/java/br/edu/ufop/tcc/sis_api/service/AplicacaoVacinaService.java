package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.AplicacaoVacinaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.AplicacaoVacinaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.AplicacaoVacinaEntity;
import br.edu.ufop.tcc.sis_api.model.entity.PacienteEntity;
import br.edu.ufop.tcc.sis_api.model.entity.ProfissionalEnfermagemEntity;
import br.edu.ufop.tcc.sis_api.model.entity.VacinaEntity;
import br.edu.ufop.tcc.sis_api.repository.AplicacaoVacinaRepository;
import br.edu.ufop.tcc.sis_api.repository.PacienteRepository;
import br.edu.ufop.tcc.sis_api.repository.ProfissionalEnfermagemRepository;
import br.edu.ufop.tcc.sis_api.repository.VacinaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AplicacaoVacinaService {

    private final AplicacaoVacinaRepository aplicacaoRepository;
    private final PacienteRepository pacienteRepository;
    private final VacinaRepository vacinaRepository;
    private final ProfissionalEnfermagemRepository profissionalRepository;

    public AplicacaoVacinaResponseDTO salvar(AplicacaoVacinaRequestDTO dto) {

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        VacinaEntity vacina = vacinaRepository.findById(dto.getVacinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vacina não encontrada"));

        ProfissionalEnfermagemEntity enfermeiro = profissionalRepository.findById(dto.getEnfermeiroId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));

        AplicacaoVacinaEntity aplicacao = AplicacaoVacinaEntity.builder()
                .dataAplicacao(dto.getDataAplicacao())
                .dose(dto.getDose())
                .paciente(paciente)
                .vacina(vacina)
                .enfermeiro(enfermeiro)
                .build();

        aplicacaoRepository.save(aplicacao);

        return converter(aplicacao);
    }

    public List<AplicacaoVacinaResponseDTO> listarTodas() {
        return aplicacaoRepository.findAll()
                .stream()
                .map(aplicacao -> this.converter(aplicacao))
                .toList();
    }

    public AplicacaoVacinaResponseDTO buscarPorId(Integer id) {

        AplicacaoVacinaEntity aplicacao = aplicacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aplicação não encontrada"));

        return converter(aplicacao);
    }

    public AplicacaoVacinaResponseDTO atualizar(Integer id, AplicacaoVacinaRequestDTO dto) {

        AplicacaoVacinaEntity aplicacao = aplicacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aplicação não encontrada"));

        PacienteEntity paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        VacinaEntity vacina = vacinaRepository.findById(dto.getVacinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vacina não encontrada"));

        ProfissionalEnfermagemEntity enfermeiro = profissionalRepository.findById(dto.getEnfermeiroId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));

        aplicacao.setDataAplicacao(dto.getDataAplicacao());
        aplicacao.setDose(dto.getDose());
        aplicacao.setPaciente(paciente);
        aplicacao.setVacina(vacina);
        aplicacao.setEnfermeiro(enfermeiro);

        aplicacaoRepository.save(aplicacao);

        return converter(aplicacao);
    }

    public void deletar(Integer id) {

        if (!aplicacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Aplicação não encontrada");
        }

        aplicacaoRepository.deleteById(id);
    }

    private AplicacaoVacinaResponseDTO converter(AplicacaoVacinaEntity aplicacao) {

        return AplicacaoVacinaResponseDTO.builder()
                .id(aplicacao.getId())
                .dataAplicacao(aplicacao.getDataAplicacao())
                .dose(aplicacao.getDose())
                .nomePaciente(aplicacao.getPaciente().getNome())
                .nomeVacina(aplicacao.getVacina().getNome())
                .nomeEnfermeiro(aplicacao.getEnfermeiro().getNome())
                .build();
    }
}
