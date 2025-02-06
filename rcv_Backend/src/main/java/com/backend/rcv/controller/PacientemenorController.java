package com.backend.rcv.controller;

import com.backend.rcv.model.Pacientemenor;
import com.backend.rcv.service.PacientemenorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientemenor")
public class PacientemenorController {

    @Autowired
    private PacientemenorService pacientemenorService;

    // Obtener todos los pacientes
    @GetMapping("/todos")
    public ResponseEntity<List<Pacientemenor>> obtenerTodosLosPacientes() {
        List<Pacientemenor> pacientes = pacientemenorService.obtenerTodosLosPacientes();
        return ResponseEntity.ok(pacientes);
    }

    // Obtener paciente por DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Pacientemenor> obtenerPacientePorDni(@PathVariable String dni) {
        Pacientemenor paciente = pacientemenorService.obtenerPacientePorDni(dni);
        return ResponseEntity.ok(paciente);
    }

    // Crear o actualizar un paciente
    @PostMapping
    public ResponseEntity<Pacientemenor> crearOActualizarPaciente(@RequestBody Pacientemenor pacienteData) {
        Pacientemenor pacienteGuardado = pacientemenorService.crearOActualizarPaciente(pacienteData);
        return ResponseEntity.status(pacienteData.getDni() != null ? 200 : 201).body(pacienteGuardado);
    }
}
