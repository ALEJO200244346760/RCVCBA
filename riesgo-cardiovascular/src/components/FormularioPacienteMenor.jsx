import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioPacienteMenor = () => {
    const [dni, setDni] = useState('');
    const [datosEnfermeria, setDatosEnfermeria] = useState(null);
    const [datosCardiologia, setDatosCardiologia] = useState({});
    const [datosPaciente, setDatosPaciente] = useState({});
    const [esPacienteNuevo, setEsPacienteNuevo] = useState(null);
    const [error, setError] = useState(null);
    const [formularioVisible, setFormularioVisible] = useState(false);

    const [edad, setEdad] = useState(''); // Edad del paciente
    const [genero, setGenero] = useState(''); // Género del paciente
    const [imc, setImc] = useState(null); // IMC calculado
    const [percentil, setPercentil] = useState(null); // Percentil calculado

    // Función para consultar los datos de enfermería
    const consultarEnfermeria = async (dni) => {
        try {
            const respuesta = await axios.get(`/api/enfermeria/${dni}`);
            if (respuesta.status === 204) {
                setEsPacienteNuevo(true);
            } else {
                setDatosEnfermeria(respuesta.data);
                setEsPacienteNuevo(false);
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    // Cálculo del IMC
    const calcularIMC = (peso, talla) => {
        if (peso && talla) {
            const imcCalculado = peso / ((talla / 100) ** 2); // Convertir talla a metros
            setImc(imcCalculado.toFixed(2)); // Guardamos el IMC con dos decimales
        }
    };

    // Cálculo del percentil (aproximación simple)
    const calcularPercentil = (peso, talla, edad, genero) => {
        // Aquí puedes utilizar una librería o tabla de percentiles real para calcular
        // El siguiente es solo un ejemplo básico que depende de los datos ingresados.
        if (edad && peso && talla && genero) {
            // Para ejemplo: se podría usar una fórmula o una librería que calcule el percentil
            // Este es solo un cálculo aproximado basado en sexo, edad, peso y talla.
            // En un escenario real, debes usar los valores referenciados en tablas médicas.
            let percentilCalculado = 50; // Suponiendo un valor promedio de percentil (50)
            setPercentil(percentilCalculado); // Establecemos un percentil base de ejemplo
        }
    };

    // Guardar los datos completos del paciente
    const guardarPaciente = async () => {
        try {
            const paciente = {
                dni,
                genero,
                edad,
                peso: datosEnfermeria?.peso || '',
                talla: datosEnfermeria?.talla || '',
                imc,
                percentil,
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

    useEffect(() => {
        if (dni.length === 8) {
            consultarEnfermeria(dni);
            setFormularioVisible(true); // Muestra formulario al ingresar el DNI
        } else {
            setDatosEnfermeria(null);
            setEsPacienteNuevo(null);
            setFormularioVisible(false); // Oculta formulario si el DNI no es válido
        }
    }, [dni]);

    const manejarCambioEnfermeria = (e) => {
        const { name, value } = e.target;
        setDatosEnfermeria((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        // Recalcular IMC y percentil cuando cambien peso o talla
        if (name === 'peso' || name === 'talla') {
            calcularIMC(datosEnfermeria?.peso, datosEnfermeria?.talla);
            calcularPercentil(datosEnfermeria?.peso, datosEnfermeria?.talla, edad, genero);
        }
    };

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setDatosPaciente((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
            <form onSubmit={guardarPaciente} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl space-y-6">
                {/* Campo de DNI */}
                <h2 className="text-2xl font-bold text-center text-gray-800">Formulario Paciente Menor</h2>

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

                {/* Mostrar el formulario cuando el DNI es válido */}
                {formularioVisible && (
                    <>
                        {/* Edad */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700">Edad:</label>
                            <input
                                type="number"
                                name="edad"
                                value={edad}
                                onChange={(e) => {
                                    setEdad(e.target.value);
                                    calcularPercentil(datosEnfermeria?.peso, datosEnfermeria?.talla, e.target.value, genero);
                                }}
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
                                onChange={(e) => {
                                    setGenero(e.target.value);
                                    calcularPercentil(datosEnfermeria?.peso, datosEnfermeria?.talla, edad, e.target.value);
                                }}
                                className="mt-1 p-3 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccione Género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>

                        {/* Peso */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700">Peso:</label>
                            <input
                                type="number"
                                name="peso"
                                value={datosEnfermeria?.peso || ''}
                                onChange={manejarCambioEnfermeria}
                                className="mt-1 p-3 border border-gray-300 rounded-md"
                                placeholder="Peso (kg)"
                            />
                        </div>

                        {/* Talla */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700">Talla:</label>
                            <input
                                type="number"
                                name="talla"
                                value={datosEnfermeria?.talla || ''}
                                onChange={manejarCambioEnfermeria}
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


                        {/* Botón de Guardar */}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white hover:bg-green-600 rounded-lg py-3 transition duration-200"
                        >
                            Guardar Datos
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default FormularioPacienteMenor;
