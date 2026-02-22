package br.edu.ufop.tcc.sis_api.service.strategy.cpf;

import org.springframework.stereotype.Component;

@Component
public class CpfValidatorSimples implements CpfValidatorStrategy {

    @Override
    public void validar(String cpf) {
        if (cpf == null || cpf.length() != 11) {
            throw new RuntimeException("CPF inválido");
        }
    }
}
