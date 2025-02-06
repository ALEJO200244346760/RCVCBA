package com.backend.rcv.controller;

import com.backend.rcv.model.Pacientemenor;
import com.backend.rcv.service.PacientemenorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientemenor")
public class PacientemenorController {

    @Autowired
    private PacientemenorService pacientemenorService;

    @GetMapping("/todos")
    public ResponseEntity<List<Pacientemenor>> obtenerTodosLosPacientes() {
        List<Pacientemenor> pacientes = pacientemenorService.obtenerTodosLosPacientes();
        if (pacientes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(pacientes);  // Asegúrate de que se esté devolviendo un JSON
    }


    // Obtener paciente por DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Pacientemenor> obtenerPacientePorDni(@PathVariable String dni) {
        Pacientemenor paciente = pacientemenorService.obtenerPacientePorDni(dni);
        if (paciente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Devuelve 404 si el paciente no se encuentra
        }
        return ResponseEntity.ok(paciente);
    }

    // Crear o actualizar un paciente
    @PostMapping
    public ResponseEntity<Pacientemenor> crearOActualizarPaciente(@RequestBody Pacientemenor pacienteData) {
        Pacientemenor pacienteGuardado = pacientemenorService.crearOActualizarPaciente(pacienteData);
        return ResponseEntity.status(pacienteData.getDni() != null ? HttpStatus.OK : HttpStatus.CREATED).body(pacienteGuardado);
    }
}
