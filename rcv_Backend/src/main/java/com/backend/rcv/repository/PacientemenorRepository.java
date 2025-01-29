package com.backend.rcv.repository;

import com.backend.rcv.model.Pacientemenor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PacientemenorRepository extends JpaRepository<Pacientemenor, String> {
    // Método para buscar un paciente por su DNI
    Optional<Pacientemenor> findByDni(String dni);
}
