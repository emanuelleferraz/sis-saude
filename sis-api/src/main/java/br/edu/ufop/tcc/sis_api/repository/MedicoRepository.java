package br.edu.ufop.tcc.sis_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufop.tcc.sis_api.model.entity.MedicoEntity;

@Repository
public interface MedicoRepository extends JpaRepository<MedicoEntity, Integer> {
}
