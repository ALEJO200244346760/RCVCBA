import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioPacienteMenor = () => {
    const [dni, setDni] = useState('');
    const [datosEnfermeria, setDatosEnfermeria] = useState(null);
    const [edad, setEdad] = useState(''); // Edad del paciente
    const [genero, setGenero] = useState(''); // Género del paciente
    const [peso, setPeso] = useState(''); // Peso del paciente
    const [talla, setTalla] = useState(''); // Talla del paciente
    const [imc, setImc] = useState(null); // IMC calculado
    const [percentil, setPercentil] = useState(null); // Percentil calculado

    // Función para consultar los datos de enfermería
    const consultarEnfermeria = async (dni) => {
        try {
            const respuesta = await axios.get(`/api/enfermeria/${dni}`);
            if (respuesta.status === 204) {
                alert("Nuevo paciente");
            } else {
                setDatosEnfermeria(respuesta.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Cálculo del IMC
    const calcularIMC = (peso, talla) => {
        if (peso && talla) {
            const imcCalculado = peso / ((talla / 100) ** 2); // Convertir talla a metros
            setImc(imcCalculado.toFixed(2)); // Guardamos el IMC con dos decimales
        }
    };

    // Cálculo del percentil
    const calcularPercentil = (peso, talla, edad, genero) => {
        // Aquí vamos a simular el cálculo de percentil, usando una tabla simplificada.
        if (edad && peso && talla && genero) {
            // Ejemplo: Datos de percentiles para un niño de 5 años.
            const percentiles = {
                "5": { peso: { masculino: 18.2, femenino: 17.8 }, talla: { masculino: 110.5, femenino: 109.5 } },
                "50": { peso: { masculino: 20.0, femenino: 19.5 }, talla: { masculino: 113.0, femenino: 112.5 } },
                "95": { peso: { masculino: 22.0, femenino: 21.5 }, talla: { masculino: 115.5, femenino: 115.0 } }
            };

            // Cálculo del percentil basado en el peso
            const percentilPeso = calcularPercentilPorRango(peso, percentiles, edad, genero, 'peso');
            const percentilTalla = calcularPercentilPorRango(talla, percentiles, edad, genero, 'talla');

            // Tomamos el promedio de los percentiles de peso y talla
            const percentilFinal = Math.round((percentilPeso + percentilTalla) / 2);

            setPercentil(percentilFinal); // Establecemos el percentil calculado
        }
    };

    // Función para calcular el percentil por rango
    const calcularPercentilPorRango = (valor, percentiles, edad, genero, tipo) => {
        // Obtener el percentil de referencia para peso o talla
        const percentil5 = percentiles["5"][tipo][genero];
        const percentil50 = percentiles["50"][tipo][genero];
        const percentil95 = percentiles["95"][tipo][genero];

        if (valor <= percentil5) return 5;
        if (valor <= percentil50) return 50;
        if (valor <= percentil95) return 95;
        return 99;
    };

    // Efecto que se activa cada vez que se cambia alguno de los campos
    useEffect(() => {
        // Recalcular IMC y percentil cuando cambien peso, talla, edad o género
        if (peso && talla && edad && genero) {
            calcularIMC(peso, talla);
            calcularPercentil(peso, talla, edad, genero);
        }
    }, [peso, talla, edad, genero]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
            <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Formulario Paciente Menor</h2>

                {/* Campo de DNI */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">DNI:</label>
                    <input
                        type="text"
                        name="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                        maxLength="8"
                        placeholder="Ingrese el DNI"
                    />
                </div>

                {/* Edad */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">Edad:</label>
                    <input
                        type="number"
                        name="edad"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                        placeholder="Edad del paciente"
                    />
                </div>

                {/* Género */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">Género:</label>
                    <select
                        name="genero"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccione Género</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                    </select>
                </div>

                {/* Peso */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">Peso (kg):</label>
                    <input
                        type="number"
                        name="peso"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                        placeholder="Peso (kg)"
                    />
                </div>

                {/* Talla */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">Talla (cm):</label>
                    <input
                        type="number"
                        name="talla"
                        value={talla}
                        onChange={(e) => setTalla(e.target.value)}
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                        placeholder="Talla (cm)"
                    />
                </div>

                {/* IMC */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">IMC:</label>
                    <input
                        type="text"
                        value={imc || ''}
                        readOnly
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Percentil */}
                <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700">Percentil:</label>
                    <input
                        type="text"
                        value={percentil || ''}
                        readOnly
                        className="mt-1 p-3 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Preguntas de Cardiología */}
                <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700">¿Hipertenso?</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setDatosCardiologia({ ...datosCardiologia, hipertenso: 'Sí' })}
                                    className={`btn ${datosCardiologia.hipertenso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded-md py-2 px-4`}
                                >
                                    Sí
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDatosCardiologia({ ...datosCardiologia, hipertenso: 'No' })}
                                    className={`btn ${datosCardiologia.hipertenso === 'No' ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded-md py-2 px-4`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700">¿Diabetes?</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setDatosCardiologia({ ...datosCardiologia, diabetes: 'Sí' })}
                                    className={`btn ${datosCardiologia.diabetes === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded-md py-2 px-4`}
                                >
                                    Sí
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDatosCardiologia({ ...datosCardiologia, diabetes: 'No' })}
                                    className={`btn ${datosCardiologia.diabetes === 'No' ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded-md py-2 px-4`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

            {/* Asma */}
            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene asma?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, asma: 'Sí' })}
                                        className={`btn ${datosPaciente.asma === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, asma: 'No' })}
                                        className={`btn ${datosPaciente.asma === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Alergias */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene Alergias?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, alergias: 'Sí' })}
                                        className={`btn ${datosPaciente.alergias === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, alergias: 'No' })}
                                        className={`btn ${datosPaciente.alergias === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Tóxicos */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tóxicos?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, fuma: 'Sí' })}
                                        className={`btn ${datosPaciente.fuma === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, fuma: 'No' })}
                                        className={`btn ${datosPaciente.fuma === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Antecedentes de soplo */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene antecedentes de soplo?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesSoplo: 'Sí' })}
                                        className={`btn ${datosPaciente.antecedentesSoplo === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesSoplo: 'No' })}
                                        className={`btn ${datosPaciente.antecedentesSoplo === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Arritmias */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene arritmias?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, arritmias: 'Sí' })}
                                        className={`btn ${datosPaciente.arritmias === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, arritmias: 'No' })}
                                        className={`btn ${datosPaciente.arritmias === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Enfermedad Crónica */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad crónica?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, enfermedadCronica: 'Sí' })}
                                        className={`btn ${datosPaciente.enfermedadCronica === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, enfermedadCronica: 'No' })}
                                        className={`btn ${datosPaciente.enfermedadCronica === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Cirugía Previa */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Ha tenido cirugía previa?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, cirugiaPrevia: 'Sí' })}
                                        className={`btn ${datosPaciente.cirugiaPrevia === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, cirugiaPrevia: 'No' })}
                                        className={`btn ${datosPaciente.cirugiaPrevia === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Antecedentes familiares de marcapaso */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene antecedentes familiares con marcapaso o cardiodesfibrilador?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesFamiliaresMarcapaso: 'Sí' })}
                                        className={`btn ${datosPaciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesFamiliaresMarcapaso: 'No' })}
                                        className={`btn ${datosPaciente.antecedentesFamiliaresMarcapaso === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Desfibriladores */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene desfibriladores?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, desfibriladores: 'Sí' })}
                                        className={`btn ${datosPaciente.desfibriladores === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDatosPaciente({ ...datosPaciente, desfibriladores: 'No' })}
                                        className={`btn ${datosPaciente.desfibriladores === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
    
                            {/* Tensión Arterial Máxima */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Tensión Arterial Máxima:</label>
                                <input
                                    type="number"
                                    name="tensionArterialMaxima"
                                    value={datosPaciente.tensionArterialMaxima || ''}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            {/* Tensión Arterial Mínima */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Tensión Arterial Mínima:</label>
                                <input
                                    type="number"
                                    name="tensionArterialMinima"
                                    value={datosPaciente.tensionArterialMinima || ''}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
    
                            {/* Electrocardiograma */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Electrocardiograma:</label>
                                <div className="mt-2 flex space-x-4">
                                    <button
                                        type="button"
                                        className={`p-2 border rounded-md ${datosPaciente.electrocardiograma === 'Normal' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                        onClick={() => manejarCambio({ target: { name: 'electrocardiograma', value: 'Normal' } })}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        type="button"
                                        className={`p-2 border rounded-md ${datosPaciente.electrocardiograma === 'Anormal' ? 'bg-red-500 text-white' : 'bg-white'}`}
                                        onClick={() => manejarCambio({ target: { name: 'electrocardiograma', value: 'Anormal' } })}
                                    >
                                        Anormal
                                    </button>
                                </div>
                            </div>
            </form>
        </div>
    );
};

export default FormularioPacienteMenor;


                        
