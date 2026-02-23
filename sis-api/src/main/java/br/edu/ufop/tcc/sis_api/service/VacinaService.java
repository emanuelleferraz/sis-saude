package br.edu.ufop.tcc.sis_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ufop.tcc.sis_api.exception.ResourceNotFoundException;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VacinaRequestDTO;
import br.edu.ufop.tcc.sis_api.model.dto.indicadores.VacinaResponseDTO;
import br.edu.ufop.tcc.sis_api.model.entity.VacinaEntity;
import br.edu.ufop.tcc.sis_api.repository.VacinaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VacinaService {

    private final VacinaRepository vacinaRepository;

    public VacinaResponseDTO salvar(VacinaRequestDTO dto) {

        VacinaEntity vacina = VacinaEntity.builder()
                .nome(dto.getNome())
                .fabricante(dto.getFabricante())
                .dosagem(dto.getDosagem())
                .build();

        vacinaRepository.save(vacina);

        return converter(vacina);
    }

    public List<VacinaResponseDTO> listarTodas() {
        return vacinaRepository.findAll()
                .stream()
                .map(this::converter)
                .toList();
    }

    public VacinaResponseDTO buscarPorId(Integer id) {

        VacinaEntity vacina = vacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacina não encontrada"));

        return converter(vacina);
    }

    public VacinaResponseDTO atualizar(Integer id, VacinaRequestDTO dto) {

        VacinaEntity vacina = vacinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacina não encontrada"));

        vacina.setNome(dto.getNome());
        vacina.setFabricante(dto.getFabricante());
        vacina.setDosagem(dto.getDosagem());

        vacinaRepository.save(vacina);

        return converter(vacina);
    }

    public void deletar(Integer id) {

        if (!vacinaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vacina não encontrada");
        }

        vacinaRepository.deleteById(id);
    }

    private VacinaResponseDTO converter(VacinaEntity vacina) {
        return VacinaResponseDTO.builder()
                .id(vacina.getId())
                .nome(vacina.getNome())
                .fabricante(vacina.getFabricante())
                .dosagem(vacina.getDosagem())
                .build();
    }
}
