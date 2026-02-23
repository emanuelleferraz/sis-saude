package br.edu.ufop.tcc.sis_api.model.entity;

import br.edu.ufop.tcc.sis_api.model.enums.EnumTypeDoenca;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doenca")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoencaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doenca")
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumTypeDoenca tipo;

    @Column(nullable = false, length = 100)
    private String classificacao;
}
