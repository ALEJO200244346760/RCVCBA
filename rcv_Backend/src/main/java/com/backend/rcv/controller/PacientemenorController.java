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

    // Obtener todos los pacientes
    @GetMapping("/todos")
    public ResponseEntity<List<Pacientemenor>> obtenerTodosLosPacientes() {
        try {
            List<Pacientemenor> pacientes = pacientemenorService.obtenerTodosLosPacientes();
            if (pacientes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Devuelve 204 si no hay pacientes
            }
            return ResponseEntity.ok(pacientes);  // Respuesta 200 con los datos en JSON
        } catch (Exception e) {
            // Manejo de errores, devuelve un error interno en caso de fallo
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Obtener paciente por DNI
    @GetMapping("/{dni}")
    public ResponseEntity<Pacientemenor> obtenerPacientePorDni(@PathVariable String dni) {
        try {
            Pacientemenor paciente = pacientemenorService.obtenerPacientePorDni(dni);
            if (paciente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Devuelve 404 si no se encuentra el paciente
            }
            return ResponseEntity.ok(paciente); // Devuelve 200 con los datos del paciente en JSON
        } catch (Exception e) {
            // Si ocurre algún error, devuelve un error 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Crear o actualizar un paciente
    @PostMapping
    public ResponseEntity<Pacientemenor> crearOActualizarPaciente(@RequestBody Pacientemenor pacienteData) {
        try {
            Pacientemenor pacienteGuardado = pacientemenorService.crearOActualizarPaciente(pacienteData);
            // Devuelve un 200 si ya existe el DNI o un 201 si se crea un nuevo paciente
            return ResponseEntity.status(pacienteData.getDni() != null ? HttpStatus.OK : HttpStatus.CREATED).body(pacienteGuardado);
        } catch (Exception e) {
            // Si ocurre un error durante la creación o actualización, devuelve 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
