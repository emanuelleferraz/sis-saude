package br.edu.ufop.tcc.sis_api.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.CardResumoDoencaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.DistribuicaoDoencaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.IncidenciaPorBairroDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.TendenciaTrimestralDTO;
import br.edu.ufop.tcc.sis_api.model.entity.ConsultaEntity;

@Repository
public interface DashboardCronicaRepository extends JpaRepository<ConsultaEntity, Long> {

    // CARD
    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.CardResumoDoencaDTO(
            COUNT(c),
            COUNT(DISTINCT b.id),
            COUNT(DISTINCT p.id),
            SUM(CASE WHEN c.dataConsulta >= :dataLimite THEN 1 ELSE 0 END)
        )
        FROM ConsultaEntity c
        JOIN c.paciente p
        JOIN p.endereco e
        JOIN e.bairro b
        WHERE c.doenca.tipo = 'CRONICA'
    """)
    CardResumoDoencaDTO buscarResumo(@Param("dataLimite") LocalDateTime dataLimite);


    // DISTRIBUIÇÃO
    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.DistribuicaoDoencaDTO(
            d.nome,
            COUNT(c)
        )
        FROM ConsultaEntity c
        JOIN c.doenca d
        WHERE d.tipo = 'CRONICA'
        GROUP BY d.nome
    """)
    List<DistribuicaoDoencaDTO> distribuicao();


    // INCIDÊNCIA


    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.IncidenciaPorBairroDTO(
            b.nome,
            d.nome,
            COUNT(c)
        )
        FROM ConsultaEntity c
        JOIN c.paciente p
        JOIN p.endereco e
        JOIN e.bairro b
        JOIN c.doenca d
        WHERE d.tipo = 'CRONICA'
        GROUP BY b.nome, d.nome
    """)
    List<IncidenciaPorBairroDTO> incidencia();


    //  TENDÊNCIA TRIMESTRAL 


    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.indicadores.TendenciaTrimestralDTO(
            EXTRACT(YEAR FROM c.dataConsulta), 
            EXTRACT(QUARTER FROM c.dataConsulta), 
            COUNT(c)
        ) 
        FROM ConsultaEntity c 
        WHERE c.doenca.tipo = 'CRONICA' 
        GROUP BY EXTRACT(YEAR FROM c.dataConsulta), EXTRACT(QUARTER FROM c.dataConsulta)
        ORDER BY EXTRACT(YEAR FROM c.dataConsulta), EXTRACT(QUARTER FROM c.dataConsulta)
    """)
    List<TendenciaTrimestralDTO> tendencia();
}
