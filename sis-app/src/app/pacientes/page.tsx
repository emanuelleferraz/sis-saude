'use client';

import { useEffect, useState } from 'react';
import { getPacientes } from '@/services/pacienteService';
import { PacienteResponseDTO } from '@/types/paciente';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<PacienteResponseDTO[]>([]);

  useEffect(() => {
    getPacientes().then(setPacientes);
  }, []);

  return (
    <div>
      <h1>Listagem de Pacientes</h1>
      <button>Registrar Paciente</button>
      <ul>
        {pacientes.map(p => (
          <li key={p.id}>
            {p.nome} - {p.cpf} - {p.sexo}
          </li>
        ))}
      </ul>
    </div>
  );
}