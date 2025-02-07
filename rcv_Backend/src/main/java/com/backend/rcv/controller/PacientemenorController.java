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

    // Obtener todos los pacientes menores
    @GetMapping
    public List<Pacientemenor> getAllPacientemenores() {
        return pacientemenorService.obtenerTodosLosPacientes(); // Retorna todos los pacientes menores
    }

    // Obtener paciente por DNI

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
