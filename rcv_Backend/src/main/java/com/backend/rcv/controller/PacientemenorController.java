package com.backend.rcv.controller;

import com.backend.rcv.exception.PacienteNoEncontradoException;
import com.backend.rcv.model.Pacientemenor;
import com.backend.rcv.repository.PacientemenorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/pacientemenor")
public class PacientemenorController {

    @Autowired
    private PacientemenorRepository pacientemenorRepository;

    // Obtener paciente por DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Pacientemenor> obtenerPacientePorDni(@PathVariable String dni) {
        Optional<Pacientemenor> paciente = pacientemenorRepository.findByDni(dni);

        if (paciente.isPresent()) {
            return ResponseEntity.ok(paciente.get());
        } else {
            throw new PacienteNoEncontradoException(dni); // Lanzar excepción personalizada
        }
    }

    // Crear o actualizar un paciente
    @PostMapping
    public ResponseEntity<Pacientemenor> crearOActualizarPaciente(@RequestBody Pacientemenor pacienteData) {
        Optional<Pacientemenor> pacienteExistente = pacientemenorRepository.findByDni(pacienteData.getDni());

        if (pacienteExistente.isPresent()) {
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

            Pacientemenor actualizado = pacientemenorRepository.save(paciente);
            return ResponseEntity.ok(actualizado);
        } else {
            Pacientemenor nuevoPaciente = new Pacientemenor(
                    pacienteData.getDni(),
                    pacienteData.getPeso(),
                    pacienteData.getTalla(),
                    pacienteData.getTensionArterial(),
                    pacienteData.getTelefono(),
                    pacienteData.getFechaNacimiento(),
                    pacienteData.getDireccion(),
                    pacienteData.getHipertenso(),
                    pacienteData.getDiabetes(),
                    pacienteData.getAsma(),
                    pacienteData.getFuma(),
                    pacienteData.getAntecedentesSoplo(),
                    pacienteData.getArritmias(),
                    pacienteData.getEnfermedadCronica(),
                    pacienteData.getCirugiaPrevia(),
                    pacienteData.getAlergias(),
                    pacienteData.getAntecedentesFamiliaresMarcapaso(),
                    pacienteData.getDesfibriladores(),
                    pacienteData.getTensionArterialMaxima(),
                    pacienteData.getTensionArterialMinima(),
                    pacienteData.getElectrocardiograma()
            );
            Pacientemenor guardado = pacientemenorRepository.save(nuevoPaciente);
            return ResponseEntity.status(201).body(guardado);
        }
    }
}
