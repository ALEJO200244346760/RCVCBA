import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioPacienteMenor = () => {
    const [dni, setDni] = useState('');
    const [datosEnfermeria, setDatosEnfermeria] = useState(null);
    const [datosCardiologia, setDatosCardiologia] = useState({});
    const [datosPaciente, setDatosPaciente] = useState({});
    const [esPacienteNuevo, setEsPacienteNuevo] = useState(null);
    const [error, setError] = useState(null);

    // Consultar datos de Enfermería por DNI
    const consultarEnfermeria = async (dni) => {
        try {
            const respuesta = await axios.get(`/api/enfermeria/${dni}`);
            if (respuesta.status === 204) {  // Verificamos si la respuesta está vacía
                setEsPacienteNuevo(true);  // Paciente nuevo, no tiene datos de enfermería
                setDatosEnfermeria(null);  // Limpiamos los datos de enfermería
            } else {
                setDatosEnfermeria(respuesta.data);  // Se encontró el paciente, cargamos los datos
                setEsPacienteNuevo(false);  // El paciente ya tiene datos de enfermería
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    // Guardar todos los datos en Pacientemenor (Final)
    const guardarPaciente = async () => {
        try {
            const paciente = {
                dni,
                genero: datosEnfermeria?.genero || '',
                peso: datosEnfermeria?.peso || '',
                talla: datosEnfermeria?.talla || '',
                tensionArterial: datosEnfermeria?.tensionArterial || '',
                hipertenso: datosCardiologia?.hipertenso || '',
                diabetes: datosCardiologia?.diabetes || '',
                asma: datosPaciente?.asma || '',
                fuma: datosPaciente?.fuma || '',
                antecedentesSoplo: datosPaciente?.antecedentesSoplo || '',
                arritmias: datosPaciente?.arritmias || '',
                enfermedadCronica: datosPaciente?.enfermedadCronica || '',
                cirugiaPrevia: datosPaciente?.cirugiaPrevia || '',
                alergias: datosPaciente?.alergias || '',
                antecedentesFamiliaresMarcapaso: datosPaciente?.antecedentesFamiliaresMarcapaso || '',
                desfibriladores: datosPaciente?.desfibriladores || '',
                tensionArterialMaxima: datosPaciente?.tensionArterialMaxima || '',
                tensionArterialMinima: datosPaciente?.tensionArterialMinima || '',
                electrocardiograma: datosPaciente?.electrocardiograma || ''
            };

            const response = await axios.post('/api/pacientemenor', paciente);
            alert('Paciente guardado exitosamente');
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    // Consultar al cambiar el DNI o al presionar "Enter"
    useEffect(() => {
        if (dni.length === 8) {
            consultarEnfermeria(dni);
        } else {
            setDatosEnfermeria(null);  // Limpiar los datos si el DNI no es válido
            setEsPacienteNuevo(null);
        }
    }, [dni]);

    // Manejo de cambios en los campos de los formularios de Enfermería
    const manejarCambioEnfermeria = (e) => {
        const { name, value } = e.target;
        setDatosEnfermeria((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejo del submit de los formularios de Enfermería
    const manejarSubmitEnfermeria = (e) => {
        e.preventDefault();
    };

    // Manejo del submit de los formularios de Cardiología
    const manejarSubmitCardiologia = (e) => {
        e.preventDefault();
        guardarPaciente();
    };

    // Manejo de cambios en los campos de los formularios de Paciente
    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setDatosPaciente((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={manejarSubmitCardiologia} className="w-full space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos de Cardiología</h2>

            {/* DNI */}
            <div className="flex flex-col mb-4">
                <label className="text-sm font-medium text-gray-700">DNI:</label>
                <input
                    type="text"
                    name="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') consultarEnfermeria(dni);
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength="8"
                />
            </div>

            {/* Mostrar datos de Enfermería */}
            {datosEnfermeria && (
                <>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Género:</label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setDatosEnfermeria({ ...datosEnfermeria, genero: 'Masculino' })}
                                className={`btn ${datosEnfermeria?.genero === 'Masculino' ? 'bg-blue-500' : 'bg-gray-200'}`}
                            >
                                Masculino
                            </button>
                            <button
                                type="button"
                                onClick={() => setDatosEnfermeria({ ...datosEnfermeria, genero: 'Femenino' })}
                                className={`btn ${datosEnfermeria?.genero === 'Femenino' ? 'bg-pink-500' : 'bg-gray-200'}`}
                            >
                                Femenino
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Peso:</label>
                        <input
                            type="number"
                            name="peso"
                            value={datosEnfermeria?.peso || ''}
                            readOnly
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Talla:</label>
                        <input
                            type="number"
                            name="talla"
                            value={datosEnfermeria?.talla || ''}
                            readOnly
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Tensión Arterial:</label>
                        <input
                            type="text"
                            name="tensionArterial"
                            value={datosEnfermeria?.tensionArterial || ''}
                            readOnly
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </>
            )}

            {/* Preguntas de Cardiología */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">¿Hipertenso?</label>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setDatosCardiologia({ ...datosCardiologia, hipertenso: 'Sí' })}
                        className={`btn ${datosCardiologia.hipertenso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                    >
                        Sí
                    </button>
                    <button
                        type="button"
                        onClick={() => setDatosCardiologia({ ...datosCardiologia, hipertenso: 'No' })}
                        className={`btn ${datosCardiologia.hipertenso === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                    >
                        No
                    </button>
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">¿Diabetes?</label>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setDatosCardiologia({ ...datosCardiologia, diabetes: 'Sí' })}
                        className={`btn ${datosCardiologia.diabetes === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                    >
                        Sí
                    </button>
                    <button
                        type="button"
                        onClick={() => setDatosCardiologia({ ...datosCardiologia, diabetes: 'No' })}
                        className={`btn ${datosCardiologia.diabetes === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
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

                            <button
                type="submit"
                className="btn bg-green-500 text-white hover:bg-green-600 rounded-lg px-4 py-2 transition duration-200 mt-4"
            >
                Guardar Datos
            </button>
        </form>
    );
};

export default FormularioPacienteMenor;
