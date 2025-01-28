package com.backend.rcv.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;

@Entity
public class Pacientemenor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Si estás usando una base de datos relacional, puedes generar el ID automáticamente
    private Long id; // ID único para cada paciente (si es necesario)

    @Column(nullable = false, unique = true)
    private String dni; // DNI único del paciente

    private Double peso; // Peso del paciente

    private Double talla; // Talla del paciente

    private String tensionArterial; // Tensión arterial (opcional)

    private String telefono; // Teléfono del paciente

    private String fechaNacimiento; // Fecha de nacimiento del paciente

    private String direccion; // Dirección del paciente

    private Boolean hipertenso; // Hipertenso (Sí/No)

    private Boolean diabetes; // Diabetes (Sí/No)

    private Boolean asma; // Asma (Sí/No)

    private Boolean fuma; // Fuma (Sí/No)

    private Boolean antecedentesSoplo; // Antecedentes de soplo (Sí/No)

    private Boolean arritmias; // Arritmias (Sí/No)

    private Boolean enfermedadCronica; // Enfermedad crónica (Sí/No)

    private Boolean cirugiaPrevia; // Cirugía previa (Sí/No)

    private String alergias; // Alergias del paciente

    private Boolean antecedentesFamiliaresMarcapaso; // Antecedentes familiares de marcapaso (Sí/No)

    private Boolean desfibriladores; // Desfibriladores (Sí/No)

    private Double tensionArterialMaxima; // Tensión arterial máxima

    private Double tensionArterialMinima; // Tensión arterial mínima

    private String electrocardiograma; // Electrocardiograma (Normal/Anormal)

    // Constructores, getters y setters

    public Pacientemenor(String dni, Double peso, Double talla, String tensionArterial, String telefono, String fechaNacimiento, String direccion, Boolean hipertenso, Boolean diabetes, Boolean asma, Boolean fuma, Boolean antecedentesSoplo, Boolean arritmias, Boolean enfermedadCronica, Boolean cirugiaPrevia, String alergias, Boolean antecedentesFamiliaresMarcapaso, Boolean desfibriladores, Double tensionArterialMaxima, Double tensionArterialMinima, String electrocardiograma) {
        this.dni = dni;
        this.peso = peso;
        this.talla = talla;
        this.tensionArterial = tensionArterial;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.direccion = direccion;
        this.hipertenso = hipertenso;
        this.diabetes = diabetes;
        this.asma = asma;
        this.fuma = fuma;
        this.antecedentesSoplo = antecedentesSoplo;
        this.arritmias = arritmias;
        this.enfermedadCronica = enfermedadCronica;
        this.cirugiaPrevia = cirugiaPrevia;
        this.alergias = alergias;
        this.antecedentesFamiliaresMarcapaso = antecedentesFamiliaresMarcapaso;
        this.desfibriladores = desfibriladores;
        this.tensionArterialMaxima = tensionArterialMaxima;
        this.tensionArterialMinima = tensionArterialMinima;
        this.electrocardiograma = electrocardiograma;
    }

    // Getters y setters para todos los campos

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public Double getTalla() {
        return talla;
    }

    public void setTalla(Double talla) {
        this.talla = talla;
    }

    public String getTensionArterial() {
        return tensionArterial;
    }

    public void setTensionArterial(String tensionArterial) {
        this.tensionArterial = tensionArterial;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Boolean getHipertenso() {
        return hipertenso;
    }

    public void setHipertenso(Boolean hipertenso) {
        this.hipertenso = hipertenso;
    }

    public Boolean getDiabetes() {
        return diabetes;
    }

    public void setDiabetes(Boolean diabetes) {
        this.diabetes = diabetes;
    }

    public Boolean getAsma() {
        return asma;
    }

    public void setAsma(Boolean asma) {
        this.asma = asma;
    }

    public Boolean getFuma() {
        return fuma;
    }

    public void setFuma(Boolean fuma) {
        this.fuma = fuma;
    }

    public Boolean getAntecedentesSoplo() {
        return antecedentesSoplo;
    }

    public void setAntecedentesSoplo(Boolean antecedentesSoplo) {
        this.antecedentesSoplo = antecedentesSoplo;
    }

    public Boolean getArritmias() {
        return arritmias;
    }

    public void setArritmias(Boolean arritmias) {
        this.arritmias = arritmias;
    }

    public Boolean getEnfermedadCronica() {
        return enfermedadCronica;
    }

    public void setEnfermedadCronica(Boolean enfermedadCronica) {
        this.enfermedadCronica = enfermedadCronica;
    }

    public Boolean getCirugiaPrevia() {
        return cirugiaPrevia;
    }

    public void setCirugiaPrevia(Boolean cirugiaPrevia) {
        this.cirugiaPrevia = cirugiaPrevia;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public Boolean getAntecedentesFamiliaresMarcapaso() {
        return antecedentesFamiliaresMarcapaso;
    }

    public void setAntecedentesFamiliaresMarcapaso(Boolean antecedentesFamiliaresMarcapaso) {
        this.antecedentesFamiliaresMarcapaso = antecedentesFamiliaresMarcapaso;
    }

    public Boolean getDesfibriladores() {
        return desfibriladores;
    }

    public void setDesfibriladores(Boolean desfibriladores) {
        this.desfibriladores = desfibriladores;
    }

    public Double getTensionArterialMaxima() {
        return tensionArterialMaxima;
    }

    public void setTensionArterialMaxima(Double tensionArterialMaxima) {
        this.tensionArterialMaxima = tensionArterialMaxima;
    }

    public Double getTensionArterialMinima() {
        return tensionArterialMinima;
    }

    public void setTensionArterialMinima(Double tensionArterialMinima) {
        this.tensionArterialMinima = tensionArterialMinima;
    }

    public String getElectrocardiograma() {
        return electrocardiograma;
    }

    public void setElectrocardiograma(String electrocardiograma) {
        this.electrocardiograma = electrocardiograma;
    }
}
