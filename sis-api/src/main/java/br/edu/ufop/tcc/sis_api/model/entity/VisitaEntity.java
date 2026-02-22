package br.edu.ufop.tcc.sis_api.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "visita")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_visita")
    private Integer id;

    @Column(name = "data_visita", nullable = false)
    private LocalDateTime dataVisita;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private PacienteEntity paciente;

    @ManyToOne
    @JoinColumn(name = "id_agente", nullable = false)
    private AgenteSaudeEntity agente;

    @ManyToMany
    @JoinTable(
        name = "visita_doenca",
        joinColumns = @JoinColumn(name = "id_visita"),
        inverseJoinColumns = @JoinColumn(name = "id_doenca")
    )
    private List<DoencaEntity> doencas;
}
