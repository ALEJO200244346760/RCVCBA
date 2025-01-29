package com.backend.rcv.repository;

import com.backend.rcv.model.Enfermeria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnfermeriaRepository extends JpaRepository<Enfermeria, String> {

    // Método para buscar por DNI
    Enfermeria findByDni(String dni);
}