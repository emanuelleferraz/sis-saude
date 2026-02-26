package br.edu.ufop.tcc.sis_api.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.AplicacaoPorUnidadeDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.CoberturaVacinalBairroDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.DistribuicaoVacinaDTO;
import br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.EvolucaoDosesTrimestreDTO;
import br.edu.ufop.tcc.sis_api.model.entity.AplicacaoVacinaEntity;

@Repository
public interface DashboardVacinaRepository extends JpaRepository<AplicacaoVacinaEntity, Integer> {

    // CARD RESUMO

    @Query("SELECT COUNT(a) FROM AplicacaoVacinaEntity a")
    Long totalDosesAplicadas();

    @Query("SELECT COUNT(DISTINCT a.paciente.id) FROM AplicacaoVacinaEntity a")
    Long totalPacientesVacinados();


    // Vacina mais aplicada
    @Query("""
        SELECT a.vacina.nome
        FROM AplicacaoVacinaEntity a
        GROUP BY a.vacina.nome
        ORDER BY COUNT(a) DESC
    """)
    List<String> vacinaMaisAplicada(Pageable pageable);


    // Bairro com menor cobertura
    @Query("""
        SELECT a.paciente.endereco.bairro.nome
        FROM AplicacaoVacinaEntity a
        GROUP BY a.paciente.endereco.bairro.nome
        ORDER BY COUNT(a) ASC
    """)
    List<String> bairroMenorCobertura(Pageable pageable);



    // DISTRIBUIÇÃO POR VACINA
    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.DistribuicaoVacinaDTO(
            a.vacina.nome,
            COUNT(a)
        )
        FROM AplicacaoVacinaEntity a
        GROUP BY a.vacina.nome
        ORDER BY COUNT(a) DESC
    """)
    List<DistribuicaoVacinaDTO> distribuicaoPorVacina();



    // EVOLUÇÃO TRIMESTRAL (POSTGRES CORRIGIDO)

    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.EvolucaoDosesTrimestreDTO(
            EXTRACT(YEAR FROM a.dataAplicacao),
            EXTRACT(QUARTER FROM a.dataAplicacao),
            COUNT(a)
        )
        FROM AplicacaoVacinaEntity a
        GROUP BY EXTRACT(YEAR FROM a.dataAplicacao),
                 EXTRACT(QUARTER FROM a.dataAplicacao)
        ORDER BY EXTRACT(YEAR FROM a.dataAplicacao),
                 EXTRACT(QUARTER FROM a.dataAplicacao)
    """)
    List<EvolucaoDosesTrimestreDTO> evolucaoTrimestral();



    // COBERTURA VACINAL POR BAIRRO
    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.CoberturaVacinalBairroDTO(
            a.paciente.endereco.bairro.nome,
            COUNT(a)
        )
        FROM AplicacaoVacinaEntity a
        GROUP BY a.paciente.endereco.bairro.nome
        ORDER BY COUNT(a) DESC
    """)
    List<CoberturaVacinalBairroDTO> coberturaVacinalPorBairro();

    // APLICAÇÕES POR UNIDADE
    @Query("""
        SELECT new br.edu.ufop.tcc.sis_api.model.dto.dashboards.vacina.AplicacaoPorUnidadeDTO(
            a.unidade.nome,
            a.vacina.nome,
            COUNT(a)
        )
        FROM AplicacaoVacinaEntity a
        GROUP BY a.unidade.nome, a.vacina.nome
        ORDER BY a.unidade.nome, a.vacina.nome
    """)
    List<AplicacaoPorUnidadeDTO> aplicacoesPorUnidade();
}