package br.edu.ufop.tcc.sis_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufop.tcc.sis_api.model.entity.DoencaEntity;

@Repository
public interface DoencaRepository extends JpaRepository<DoencaEntity, Integer> {
}