package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.model.dto.profissionais.MedicoRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.profissionais.MedicoResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.MedicoEntity;
import br.edu.ufop.tcc.sis_api.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;

    public MedicoResponseDTO salvar(MedicoRequestDTO dto) {

        MedicoEntity medico = MedicoEntity.builder()
                .nome(dto.getNome())
                .crm(dto.getCrm())
                .especialidade(dto.getEspecialidade())
                .build();

        medicoRepository.save(medico);
        return converter(medico);
    }

    public MedicoResponseDTO atualizar(Integer id, MedicoRequestDTO dto) {

        MedicoEntity medico = medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        medico.setNome(dto.getNome());
        medico.setCrm(dto.getCrm());
        medico.setEspecialidade(dto.getEspecialidade());

        medicoRepository.save(medico);

        return converter(medico);
    }

    public List<MedicoResponseDTO> listarTodos() {
        return medicoRepository.findAll()
                .stream()
                .map(this::converter)
                .toList();
    }

    public MedicoResponseDTO buscarPorId(Integer id) {
        MedicoEntity medico = medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        return converter(medico);
    }

    public void deletar(Integer id) {
        if (!medicoRepository.existsById(id)) {
            throw new RuntimeException("Médico não encontrado");
        }
        medicoRepository.deleteById(id);
    }

    private MedicoResponseDTO converter(MedicoEntity medico) {
        return MedicoResponseDTO.builder()
                .id(medico.getId())
                .nome(medico.getNome())
                .crm(medico.getCrm())
                .especialidade(medico.getEspecialidade())
                .build();
    }
}