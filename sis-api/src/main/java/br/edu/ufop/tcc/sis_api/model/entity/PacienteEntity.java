package br.edu.ufop.tcc.sis_api.model.entity;

import java.time.LocalDate;
import java.util.List;

import br.edu.ufop.tcc.sis_api.model.enums.EnumSexoPaciente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "paciente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(unique = true)
    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexo", nullable = false)
    private EnumSexoPaciente sexo;

    private String telefone;

    @ManyToOne
    @JoinColumn(name = "id_endereco", nullable = false)
    private EnderecoEntity endereco;

    @ManyToMany
    @JoinTable(
        name = "paciente_doenca",
        joinColumns = @JoinColumn(name = "id_paciente"),
        inverseJoinColumns = @JoinColumn(name = "id_doenca")
    )
    private List<DoencaEntity> doencas;
}
