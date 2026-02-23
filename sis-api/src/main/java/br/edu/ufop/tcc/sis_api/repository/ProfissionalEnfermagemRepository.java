package br.edu.ufop.tcc.sis_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufop.tcc.sis_api.model.entity.ProfissionalEnfermagemEntity;

public interface ProfissionalEnfermagemRepository
        extends JpaRepository<ProfissionalEnfermagemEntity, Integer> {
}
