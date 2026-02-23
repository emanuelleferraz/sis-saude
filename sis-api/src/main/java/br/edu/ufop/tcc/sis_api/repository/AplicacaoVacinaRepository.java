package br.edu.ufop.tcc.sis_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufop.tcc.sis_api.model.entity.AplicacaoVacinaEntity;

public interface AplicacaoVacinaRepository 
        extends JpaRepository<AplicacaoVacinaEntity, Integer> {

                List<AplicacaoVacinaEntity> findByPacienteId(Integer pacienteId);
}