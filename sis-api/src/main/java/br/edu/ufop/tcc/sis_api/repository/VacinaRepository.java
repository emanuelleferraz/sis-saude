package br.edu.ufop.tcc.sis_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufop.tcc.sis_api.model.entity.VacinaEntity;

public interface VacinaRepository extends JpaRepository<VacinaEntity, Integer> {
}
