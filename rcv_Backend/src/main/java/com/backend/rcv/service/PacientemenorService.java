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
            paciente.setHipertenso(pacienteData.getHipertenso());
            paciente.setDiabetes(pacienteData.getDiabetes());
            paciente.setAsma(pacienteData.getAsma());
            paciente.setFuma(pacienteData.getFuma());
            paciente.setAntecedentesSoplo(pacienteData.getAntecedentesSoplo());
            paciente.setArritmias(pacienteData.getArritmias());
            paciente.setEnfermedadCronica(pacienteData.getEnfermedadCronica());
            paciente.setCirugiaPrevia(pacienteData.getCirugiaPrevia());
            paciente.setAlergias(pacienteData.getAlergias());
            paciente.setAntecedentesFamiliaresMarcapaso(pacienteData.getAntecedentesFamiliaresMarcapaso());
            paciente.setDesfibriladores(pacienteData.getDesfibriladores());
            paciente.setTensionArterialMaxima(pacienteData.getTensionArterialMaxima());
            paciente.setTensionArterialMinima(pacienteData.getTensionArterialMinima());
            paciente.setElectrocardiograma(pacienteData.getElectrocardiograma());

            return pacientemenorRepository.save(paciente);
        } else {
            // Crear nuevo paciente
            return pacientemenorRepository.save(pacienteData);
        }
    }
}
