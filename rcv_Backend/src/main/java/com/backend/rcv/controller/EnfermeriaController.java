package com.backend.rcv.controller;

import com.backend.rcv.model.Enfermeria;
import com.backend.rcv.service.EnfermeriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enfermeria")
public class EnfermeriaController {

    @Autowired
    private EnfermeriaService enfermeriaService;

    // Crear o actualizar los datos de enfermería para un paciente (buscando por DNI)
    @PostMapping("/{dni}")
    public ResponseEntity<Enfermeria> crearOActualizarDatosEnfermeria(@PathVariable String dni, @RequestBody Enfermeria datosEnfermeria) {
        try {
            Enfermeria enfermeria = enfermeriaService.crearOActualizarEnfermeria(dni, datosEnfermeria);
            return new ResponseEntity<>(enfermeria, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
