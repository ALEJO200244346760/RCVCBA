package com.backend.rcv.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "enfermeria")
public class Enfermeria {

    @Id
    @Column(name = "dni", unique = true, nullable = false)
    private String dni;  // DNI del paciente

    @Column(name = "peso", nullable = false)
    private double peso;  // Peso del paciente

    @Column(name = "talla", nullable = false)
    private double talla;  // Talla del paciente

    @Column(name = "tension_arterial", nullable = true)
    private String tensionArterial;  // Tensión arterial (opcional)

    // Constructor vacío
    public Enfermeria() {
    }

    // Constructor con parámetros
    public Enfermeria(String dni, double peso, double talla, String tensionArterial) {
        this.dni = dni;
        this.peso = peso;
        this.talla = talla;
        this.tensionArterial = tensionArterial;
    }

    // Getters y Setters
    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public double getTalla() {
        return talla;
    }

    public void setTalla(double talla) {
        this.talla = talla;
    }

    public String getTensionArterial() {
        return tensionArterial;
    }

    public void setTensionArterial(String tensionArterial) {
        this.tensionArterial = tensionArterial;
    }
}
