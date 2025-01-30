package com.backend.rcv.controller;

import com.backend.rcv.exception.PacienteNoEncontradoException;
import com.backend.rcv.model.Pacientemenor;
import com.backend.rcv.service.PacientemenorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pacientemenor")
public class PacientemenorController {

    @Autowired
    private PacientemenorService pacientemenorService;

    // Obtener paciente por DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Pacientemenor> obtenerPacientePorDni(@PathVariable String dni) {
        return pacientemenorService.obtenerPacientePorDni(dni)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new PacienteNoEncontradoException(dni)); // Lanzar excepción personalizada
    }

    // Crear o actualizar un paciente
    @PostMapping
    public ResponseEntity<Pacientemenor> crearOActualizarPaciente(@Valid @RequestBody Pacientemenor pacienteData) {
        Pacientemenor pacienteGuardado = pacientemenorService.crearOActualizarPaciente(pacienteData);
        if (pacienteGuardado == null) {
            return ResponseEntity.status(500).body(null); // Error interno si no se pudo guardar
        }
        return ResponseEntity.status(pacienteData.getDni() != null ? 200 : 201).body(pacienteGuardado);
    }
}
