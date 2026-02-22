package br.edu.ufop.tcc.sis_api.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profissional_enfermagem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfissionalEnfermagemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_enfermeiro")
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(unique = true, length = 20)
    private String coren;

    private String telefone;

    @ManyToOne
    @JoinColumn(name = "id_unidade", nullable = false)
    private UnidadePsfEntity unidade;
}
