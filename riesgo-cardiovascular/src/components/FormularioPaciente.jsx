import React, { useState, useEffect } from 'react';

const FormularioPaciente = () => {
    const [dni, setDni] = useState('');
    const [datosPaciente, setDatosPaciente] = useState({});
    const [esPacienteNuevo, setEsPacienteNuevo] = useState(null);
    const [error, setError] = useState(null);

    // Función para consultar el paciente por DNI
    const consultarPaciente = async (dni) => {
        try {
            const respuesta = await fetch(`/api/pacientemenor/${dni}`);

            // Verificamos si la respuesta es correcta (código de estado 200-299)
            if (!respuesta.ok) {
                // Si la respuesta no es 2xx, lanzamos un error
                throw new Error(`Error: ${respuesta.status} - ${respuesta.statusText}`);
            }

            const data = await respuesta.json();

            // Verificamos si la respuesta contiene datos
            if (data) {
                setDatosPaciente(data);
                setEsPacienteNuevo(false);
            } else {
                setEsPacienteNuevo(true);
            }
        } catch (err) {
            setError(err.message); // Capturamos y mostramos el error si algo sale mal
            setEsPacienteNuevo(true); // Si hay un error, consideramos que es un paciente nuevo
        }
    };

    // Usamos useEffect para hacer la consulta cuando el DNI cambie
    useEffect(() => {
        if (dni) {
            consultarPaciente(dni);
        }
    }, [dni]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosPaciente({
            ...datosPaciente,
            [name]: value
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();

        try {
            // Si el paciente es nuevo, lo enviamos al endpoint pacientemenor
            const endpoint = esPacienteNuevo ? '/api/pacientemenor' : `/api/pacientemenor/${dni}`;
            const response = await fetch(endpoint, {
                method: esPacienteNuevo ? 'POST' : 'PUT',  // POST si es nuevo, PUT si es actualización
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosPaciente),
            });

            if (response.ok) {
                alert('Datos guardados correctamente');
            } else {
                alert('Hubo un error al guardar los datos');
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
            alert('Hubo un error al enviar los datos');
        }
    };

    const handleDniChange = (e) => {
        setDni(e.target.value);
    };

    useEffect(() => {
        if (dni.length === 8) {
            consultarPaciente(dni);
        }
    }, [dni]);

    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Formulario de Evaluación</h1>

            {/* DNI */}
            <div className="flex flex-col mb-4">
                <label className="text-sm font-medium text-gray-700">DNI:</label>
                <input
                    type="text"
                    name="dni"
                    value={dni}
                    onChange={handleDniChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength="8"
                />
            </div>

            {/* Si es un paciente nuevo, mostramos los datos de enfermería */}
            {esPacienteNuevo !== null && esPacienteNuevo ? (
                <form onSubmit={manejarSubmit} className="w-full space-y-6">
                    <h2 className="text-xl font-bold mb-4">Datos de Enfermería</h2>

                    {/* Peso */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Peso:</label>
                        <input
                            type="number"
                            name="peso"
                            value={datosPaciente.peso || ''}
                            onChange={manejarCambio}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Talla */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Talla:</label>
                        <input
                            type="number"
                            name="talla"
                            value={datosPaciente.talla || ''}
                            onChange={manejarCambio}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Tensión Arterial (opcional) */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Tensión Arterial (Opcional):</label>
                        <input
                            type="text"
                            name="tensionArterial"
                            value={datosPaciente.tensionArterial || ''}
                            onChange={manejarCambio}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Enviar formulario de enfermería */}
                    <button
                        type="submit"
                        className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 transition duration-200 mt-4"
                    >
                        Siguiente
                    </button>
                </form>
            ) : (
                esPacienteNuevo === false && (
                    <form onSubmit={manejarSubmit} className="w-full space-y-6">
                    <h2 className="text-xl font-bold mb-4">Datos de Enfermería</h2>

                    {/* Rellenar con los datos ya existentes */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Peso:</label>
                        <input
                        type="number"
                        name="peso"
                        value={datosPaciente.peso || ''}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Talla:</label>
                        <input
                        type="number"
                        name="talla"
                        value={datosPaciente.talla || ''}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Tensión Arterial */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Tensión Arterial:</label>
                        <input
                        type="text"
                        name="tensionArterial"
                        value={datosPaciente.tensionArterial || ''}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Formulario de Cardiología */}
                    <h2 className="text-xl font-bold mt-6 mb-4">Datos de Cardiología</h2>

                    {/* Hipertenso */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">¿Es hipertenso?</label>
                        <div className="flex space-x-4">
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, hipertenso: 'Sí' })}
                            className={`btn ${datosPaciente.hipertenso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, hipertenso: 'No' })}
                            className={`btn ${datosPaciente.hipertenso === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            No
                        </button>
                        </div>
                    </div>

                    {/* Diabetes */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">¿Tiene diabetes?</label>
                        <div className="flex space-x-4">
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, diabetes: 'Sí' })}
                            className={`btn ${datosPaciente.diabetes === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, diabetes: 'No' })}
                            className={`btn ${datosPaciente.diabetes === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
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
                            onClick={() => setDatosPaciente({ ...datosPaciente, asma: 'Sí' })}
                            className={`btn ${datosPaciente.asma === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, asma: 'No' })}
                            className={`btn ${datosPaciente.asma === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            No
                        </button>
                        </div>
                    </div>

                    {/* Fuma */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">¿Fuma?</label>
                        <div className="flex space-x-4">
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, fuma: 'Sí' })}
                            className={`btn ${datosPaciente.fuma === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
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
                            onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesSoplo: 'Sí' })}
                            className={`btn ${datosPaciente.antecedentesSoplo === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
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
                            onClick={() => setDatosPaciente({ ...datosPaciente, arritmias: 'Sí' })}
                            className={`btn ${datosPaciente.arritmias === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
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
                            onClick={() => setDatosPaciente({ ...datosPaciente, enfermedadCronica: 'Sí' })}
                            className={`btn ${datosPaciente.enfermedadCronica === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
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
                            onClick={() => setDatosPaciente({ ...datosPaciente, cirugiaPrevia: 'Sí' })}
                            className={`btn ${datosPaciente.cirugiaPrevia === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, cirugiaPrevia: 'No' })}
                            className={`btn ${datosPaciente.cirugiaPrevia === 'No' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            No
                        </button>
                        </div>
                    </div>

                    {/* Alergias */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Alergias:</label>
                        <input
                        type="text"
                        name="alergias"
                        value={datosPaciente.alergias || ''}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Antecedentes familiares de marcapaso */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">¿Tiene antecedentes familiares de marcapaso?</label>
                        <div className="flex space-x-4">
                        <button
                            onClick={() => setDatosPaciente({ ...datosPaciente, antecedentesFamiliaresMarcapaso: 'Sí' })}
                            className={`btn ${datosPaciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
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
                            onClick={() => setDatosPaciente({ ...datosPaciente, desfibriladores: 'Sí' })}
                            className={`btn ${datosPaciente.desfibriladores === 'Sí' ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                            Sí
                        </button>
                        <button
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
                        <select
                        name="electrocardiograma"
                        value={datosPaciente.electrocardiograma || ''}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        >
                        <option value="">Selecciona...</option>
                        <option value="Normal">Normal</option>
                        <option value="Anormal">Anormal</option>
                        </select>
                    </div>

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 transition duration-200 mt-4"
                    >
                        Enviar
                    </button>
                    </form>
                )
            )}
        </div>
    );
};

export default FormularioPaciente;
