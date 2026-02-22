package br.edu.ufop.tcc.sis_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufop.tcc.sis_api.model.entity.ConsultaEntity;

@Repository
public interface ConsultaRepository extends JpaRepository<ConsultaEntity, Integer> {
}
