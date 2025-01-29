package com.backend.rcv.service;

import com.backend.rcv.model.Pacientemenor;
import com.backend.rcv.repository.PacientemenorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PacientemenorService {

    private final PacientemenorRepository pacientemenorRepository;

    @Autowired
    public PacientemenorService(PacientemenorRepository pacientemenorRepository) {
        this.pacientemenorRepository = pacientemenorRepository;
    }

    // Obtener paciente por DNI
    public Optional<Pacientemenor> obtenerPacientePorDni(String dni) {
        return pacientemenorRepository.findByDni(dni);
    }

    // Crear o actualizar paciente
    public Pacientemenor crearOActualizarPaciente(Pacientemenor pacienteData) {
        // Verifica si el paciente ya existe
        Optional<Pacientemenor> pacienteExistente = pacientemenorRepository.findByDni(pacienteData.getDni());

        if (pacienteExistente.isPresent()) {
            // Actualizar paciente existente
            Pacientemenor paciente = pacienteExistente.get();
            paciente.setPeso(pacienteData.getPeso());
            paciente.setTalla(pacienteData.getTalla());
            paciente.setTensionArterial(pacienteData.getTensionArterial());
            paciente.setTelefono(pacienteData.getTelefono());
            paciente.setFechaNacimiento(pacienteData.getFechaNacimiento());
            paciente.setDireccion(pacienteData.getDireccion());
            // Actualiza los demás campos según sea necesario

            return pacientemenorRepository.save(paciente);
        } else {
            // Crear nuevo paciente
            return pacientemenorRepository.save(pacienteData);
        }
    }
}
