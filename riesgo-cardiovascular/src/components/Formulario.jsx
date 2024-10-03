import React, { useEffect, useState } from 'react';
import { calcularRiesgoCardiovascular } from './Calculadora';
import { Advertencia, DatosPacienteInicial, obtenerColorRiesgo, obtenerTextoRiesgo,listaNotificacionRiesgo, listaHipertensionArterial, listaMedicacionPrescripcion, listaMedicacionDispensa, listaTabaquismo, listaLaboratorio } from './ConstFormulario';
import { getLocations } from '../services/userService';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación



const Formulario = () => {
    // Verifica si ya hay una declaración de pacientes aquí
    const [datosPaciente, setDatosPaciente] = useState(DatosPacienteInicial);
    const [nivelColesterolConocido, setNivelColesterolConocido] = useState(null);
    const [nivelRiesgo, setNivelRiesgo] = useState(null);
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalAdvertencia, setModalAdvertencia] = useState(null);
    const [mostrarModalMedicamentos, setMostrarModalMedicamentos] = useState(false);
    const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState({
        notificacionRiesgo: [],
        hipertensionArterial: [],
        medicacionPrescripcion: [],
        medicacionDispensa: [],
        tabaquismo: [],
        laboratorio: [],
    });
    const [medicamentos, setMedicamentos] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [medicamentosNotificacionRiesgo, setMedicamentosNotificacionRiesgo] = useState([]);
    const [medicamentosHipertensionArterial, setMedicamentosHipertensionArterial] = useState([]);
    const [medicamentosPrescripcion, setMedicamentosPrescripcion] = useState([]);
    const [medicamentosDispensa, setMedicamentosDispensa] = useState([]);
    const [medicamentosTabaquismo, setMedicamentosTabaquismo] = useState([]);
    const [medicamentosLaboratorio, setMedicamentosLaboratorio] = useState([]);
    const [esPrimeraVisita, setEsPrimeraVisita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cuil, setCuil] = useState('');
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const { user, roles } = useAuth(); // Obtiene el usuario y roles del contexto


    useEffect(() => {
        const fetchUbicaciones = async () => {
            const ubicacionesData = await getLocations();
            setUbicaciones(ubicacionesData);
        };

        fetchUbicaciones();
    }, []);

    const validarCuil = (cuil) => {
        const soloNumeros = /^\d+$/; // Expresión regular para solo números

        if (cuil.length < 7 || !soloNumeros.test(cuil)) {
            setError('El CUIL o DNI debe tener al menos 7 dígitos y contener solo números.');
        } else {
            setError('');
        }
    };

    useEffect(() => {
        // Asignar la ubicación del usuario al estado inicial si es un usuario normal
        if (user && user.ubicacion) {
            setDatosPaciente(prevState => ({
                ...prevState,
                ubicacion: user.ubicacion.nombre // Asegúrate de que esté usando el nombre correcto
            }));
        }
        console.log('Usuario:', user);

    }, [user]);

    const hasCardiologoRole = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGO');


    useEffect(() => {
        axiosInstance.get('/api/pacientes')
            .then(response => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setPacientes(data);
                } else {
                    console.error('La respuesta de la API no es un arreglo');
                }
            })
            .catch(error => {
                console.error('Error al obtener los pacientes:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    const buscarPaciente = () => {
        const paciente = pacientes.find(paciente => paciente.cuil === cuil);
        if (paciente) {
            setPacienteEncontrado(paciente);
        } else {
            alert('Paciente no encontrado');
        }
    };

    const getPacienteByCuil = (cuil) => {
        // Busca en el array de pacientes que se pasa como prop
        return pacientes.find(paciente => paciente.cuil === cuil);
    };
    
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosPaciente({
            ...datosPaciente,
            [name]: value,
        });
        validarCuil(value);
    };

    const manejarSeleccionColesterol = (value) => {
        setNivelColesterolConocido(value === 'si');
        setDatosPaciente({
            ...datosPaciente,
            colesterol: value === 'no' ? 'No' : datosPaciente.colesterol
        });
    };

    const calcularIMC = () => {
        const peso = parseFloat(datosPaciente.peso);
        const tallaCm = parseFloat(datosPaciente.talla);
        if (peso && tallaCm) {
            const tallaM = tallaCm / 100; // Convertir centímetros a metros
            const imc = peso / (tallaM * tallaM);
            return imc.toFixed(2);
        }
        return '';
    };

    const ajustarEdad = (edad) => {
        if (edad < 50) return 40;
        if (edad >= 50 && edad <= 59) return 50;
        if (edad >= 60 && edad <= 69) return 60;
        return 70;
    };

    const ajustarPresionArterial = (presion) => {
        if (presion < 140) return 120;
        if (presion >= 140 && presion <= 159) return 140;
        if (presion >= 160 && presion <= 179) return 160;
        return 180;
    };

    const validarCampos = () => {
        const { edad, genero, diabetes, fumador, presionArterial, ubicacion, colesterol, hipertenso, acv, renal, infarto, peso, talla } = datosPaciente;
        return edad && genero && diabetes && fumador && presionArterial && ubicacion && colesterol && hipertenso && acv && infarto && peso && talla && renal;
    };

    const calcularRiesgo = async () => {
        if (!validarCampos()) {
            setModalAdvertencia('Todos los campos deben estar completos.');
            setMostrarModal(true);
            return;
        }
    
        if (nivelColesterolConocido && !datosPaciente.colesterol) {
            setModalAdvertencia('Debe ingresar el nivel de colesterol.');
            setMostrarModal(true);
            return;
        }
    
        const { edad, genero, diabetes, fumador, presionArterial, colesterol, infarto, acv, renal } = datosPaciente;
    
        // Verificar si infarto o acv son "Sí"
        if (infarto === "Sí" || acv === "Sí" || renal === "Sí") {
            setNivelRiesgo(">20% <30% Alto");
            setMostrarModal(true);
            return;
        }
    
        // Ajustar la edad y la presión arterial
        const edadAjustada = ajustarEdad(parseInt(edad, 10));
        const presionAjustada = ajustarPresionArterial(parseInt(presionArterial, 10));
    
        // Calcular el IMC
        const imc = calcularIMC();
        setDatosPaciente((prevDatos) => ({ ...prevDatos, imc }));
    
        // Calcular el riesgo
        const nivelRiesgo = calcularRiesgoCardiovascular(edadAjustada, genero, diabetes, fumador, presionAjustada, colesterol);
        setNivelRiesgo(nivelRiesgo);
        setMostrarModal(true);
    
        // Incluir los medicamentos seleccionados
        const { medicamentos } = datosPaciente;
    };    

    const guardarPaciente = async () => {
        try {
            // Si no hay medicamentos seleccionados, asegurarse de que se envíe una lista vacía o un valor adecuado
            const medicamentosArray = datosPaciente.medicamentos || [''];
            const medicamentosString = medicamentosArray.join(';');
            
            // Actualizar los datos del paciente para que los medicamentos vacíos no se guarden
            await axiosInstance.post('/api/pacientes', {
                ...datosPaciente,
                nivelRiesgo,
            });
    
            console.log('Datos guardados exitosamente');
            setMensajeExito('Paciente guardado con éxito');
            setTimeout(() => setMensajeExito(''), 3000);
            setTimeout(() => {
                window.location.href = '/Formulario'; // Redirigir a la página deseada
            }, 1000);
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            setModalAdvertencia('Ocurrió un error al guardar los datos. Por favor, vuelva a cargar la página.');
            setMostrarModal(true);
        }
    };
    
    const toggleModalMedicamentos = () => {
        setMostrarModalMedicamentos(!mostrarModalMedicamentos);
    };

    const handleMedicamentoChange = (categoria, evento) => {
        const { value, checked } = evento.target;
        setMedicamentosSeleccionados((prevSeleccionados) => {
            const nuevosSeleccionados = checked
                ? [...prevSeleccionados[categoria], value]
                : prevSeleccionados[categoria].filter((med) => med !== value);
            return {
                ...prevSeleccionados,
                [categoria]: nuevosSeleccionados,
            };
        });
    };

    const guardarMedicamentos = () => {
        const nuevosDatosPaciente = {
            ...datosPaciente,
            notificacionRiesgo: medicamentosSeleccionados.notificacionRiesgo.length > 0 ? medicamentosSeleccionados.notificacionRiesgo.join('; ') : '',
            hipertensionArterial: medicamentosSeleccionados.hipertensionArterial.length > 0 ? medicamentosSeleccionados.hipertensionArterial.join('; ') : '',
            medicacionPrescripcion: medicamentosSeleccionados.medicacionPrescripcion.length > 0 ? medicamentosSeleccionados.medicacionPrescripcion.join('; ') : '',
            medicacionDispensa: medicamentosSeleccionados.medicacionDispensa.length > 0 ? medicamentosSeleccionados.medicacionDispensa.join('; ') : '',
            tabaquismo: medicamentosSeleccionados.tabaquismo.length > 0 ? medicamentosSeleccionados.tabaquismo.join('; ') : '',
            laboratorio: medicamentosSeleccionados.laboratorio.length > 0 ? medicamentosSeleccionados.laboratorio.join('; ') : '',
        };
        setDatosPaciente(nuevosDatosPaciente);
        setMensajeExito('Medicamentos guardados con éxito');
        toggleModalMedicamentos(); // Cerrar el modal
    };
    
    const cerrarModal = () => {
        setMostrarModal(false); // Cierra el modal principal
        setMostrarModalMedicamentos(false); // Cierra el modal de medicamentos si está abierto
        setModalAdvertencia(null); // Resetea la advertencia
    };
    
    const abrirModalAdvertencia = (nivel) => {
        setModalAdvertencia(Advertencia[nivel]);
    };
    
    const renderRiesgoGrid = (riesgo) => {
        const riesgos = [
            '<10% Bajo',
            '>10% <20% Moderado',
            '>20% <30% Alto',
            '>30% <40% Muy Alto',
            '>40% Crítico'
        ];
        return (
            <div className="grid grid-cols-12 gap-2">
                {riesgos.map((nivel, index) => (
                    <React.Fragment key={nivel}>
                        <div className={`col-span-4 ${obtenerColorRiesgo(nivel)}`}></div>
                        <div
                            className={`col-span-8 ${riesgo === nivel ? obtenerColorRiesgo(nivel) : 'bg-gray-300'} p-2 cursor-pointer`}
                            onClick={() => abrirModalAdvertencia(nivel)}
                        >
                            <span className={`${riesgo === nivel ? 'text-white' : 'text-gray-600'}`}>{obtenerTextoRiesgo(nivel)}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
        {esPrimeraVisita === null ? (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">¿Es la primera visita?</h2>
            <div className="flex justify-center space-x-4">
                <button 
                    onClick={() => setEsPrimeraVisita(true)} 
                    className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2 transition duration-200"
                >
                    Sí
                </button>
                <button 
                    onClick={() => setEsPrimeraVisita(false)} 
                    className="btn bg-red-500 text-white hover:bg-red-600 rounded-lg px-4 py-2 transition duration-200"
                >
                    No
                </button>
            </div>
        </div>
        
        ) : esPrimeraVisita ? (
            <form className="w-full space-y-6">
                <h1 className="text-3xl font-bold mb-6">Formulario de Evaluación de Riesgo Cardiovascular</h1>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Ubicación:</label>
                    <select
                        name="ubicacion"
                        value={datosPaciente.ubicacion}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Seleccione una ubicación</option>
                        {hasCardiologoRole ? (
                            // Mostrar todas las ubicaciones si es administrador
                            ubicaciones.map(ubicacion => (
                                <option key={ubicacion.id} value={ubicacion.nombre}>
                                    {ubicacion.nombre}
                                </option>
                            ))
                        ) : (
                            // Mostrar solo la ubicación asignada al usuario normal
                            <option key={user.ubicacion?.id} value={user.ubicacion?.nombre}>
                                {user.ubicacion?.nombre}
                            </option>
                        )}
                    </select>
                </div>

                {/* Cuil */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">CUIL o DNI:</label>
                    <input
                        type="text" // Cambiado a texto para permitir más de 9 dígitos
                        name="cuil"
                        value={datosPaciente.cuil}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ appearance: 'none' }}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Edad */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Edad:</label>
                    <input
                        type="number"
                        name="edad"
                        value={datosPaciente.edad}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Género */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Género:</label>
                    <div className="flex space-x-2">
                        {['masculino', 'femenino'].map(option => (
                            <button
                                key={option}
                                type="button"
                                className={`p-2 border rounded ${datosPaciente.genero === option ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, genero: option }))}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Diabetes */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Diabetes:</label>
                    <div className="flex space-x-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, diabetes: option })}
                                className={`p-2 border rounded-md ${datosPaciente.diabetes === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fumador */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Es fumador?</label>
                    <div className="flex space-x-2 mb-2">
                        {['sí', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, fumador: option })}
                                className={`p-2 border rounded-md ${datosPaciente.fumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Presión Arterial */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Presión Arterial sistólica:</label>
                    <input
                        type="number"
                        name="presionArterial"
                        value={datosPaciente.presionArterial}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ appearance: 'none' }}
                    />
                </div>

                {/* Peso */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Peso (kg):</label>
                    <input
                        type="number"
                        name="peso"
                        value={datosPaciente.peso}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Talla */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Talla (cm):</label>
                    <input
                        type="number"
                        name="talla"
                        value={datosPaciente.talla}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Hipertenso */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Es hipertenso?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, hipertenso: option })}
                                className={`p-2 border rounded-md ${datosPaciente.hipertenso === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Infarto */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Ha tenido un infarto?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, infarto: option })}
                                className={`p-2 border rounded-md ${datosPaciente.infarto === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ACV */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Ha tenido un ACV?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, acv: option })}
                                className={`p-2 border rounded-md ${datosPaciente.acv === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enfermedad Renal Cronica */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Renal Crónica?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, renal : option })}
                        className={`p-2 border rounded-md ${datosPaciente.renal === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Colesterol */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Conoce su nivel de colesterol?</label>
                    <div className="flex space-x-2 mb-2">
                        {['si', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => manejarSeleccionColesterol(option)}
                                className={`p-2 border rounded-md ${nivelColesterolConocido === (option === 'si') ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                    {nivelColesterolConocido === true && (
                        <input
                            type="number"
                            name="colesterol"
                            value={datosPaciente.colesterol === 'No' ? '' : datosPaciente.colesterol}
                            onChange={manejarCambio}
                            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            style={{ appearance: 'none' }}
                        />
                    )}
                </div>
                <button
                    type="button"
                    onClick={calcularRiesgo}
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                    Calcular Riesgo
                </button>
            </form>
        ) : (
            <div className="w-full space-y-6">
                <h2 className="text-lg font-bold">Ingrese el CUIL del paciente:</h2>
                <input
                    type="text"
                    value={cuil}
                    onChange={(e) => setCuil(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button onClick={buscarPaciente} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Buscar Paciente
                </button>

                {pacienteEncontrado && (
                    <div className="flex w-full space-x-4 mt-6">
                    <div className="flex-1 bg-gray-100 p-4 rounded-md">
                        <h2 className="text-lg font-bold">Datos del Paciente:</h2>
                        {pacienteEncontrado ? (
                            <>
                                <p><strong>Edad:</strong> {pacienteEncontrado.edad}</p>
                                <p><strong>CUIL:</strong> {pacienteEncontrado.cuil}</p>
                                <p><strong>Ubicación:</strong> {pacienteEncontrado.ubicacion}</p>
                                <p><strong>Fecha registro:</strong> {pacienteEncontrado.fechaRegistro}</p>
                                <p><strong>Género:</strong> {pacienteEncontrado.genero}</p>
                                <p><strong>Diabetes:</strong> {pacienteEncontrado.diabetes}</p>
                                <p><strong>Fumador:</strong> {pacienteEncontrado.fumador}</p>
                                <p><strong>Presión:</strong> {pacienteEncontrado.presionArterial}</p>
                                <p><strong>Colesterol:</strong> {pacienteEncontrado.colesterol}</p>
                                <p><strong>Peso:</strong> {pacienteEncontrado.peso}</p>
                                <p><strong>Talla:</strong> {pacienteEncontrado.talla}</p>
                                <p><strong>IMC:</strong> {pacienteEncontrado.imc}</p>
                                <p><strong>Hipertenso:</strong> {pacienteEncontrado.hipertenso}</p>
                                <p><strong>Infarto:</strong> {pacienteEncontrado.infarto}</p>
                                <p><strong>ACV:</strong> {pacienteEncontrado.acv}</p>
                                <p><strong>Notificacion de riesgo:</strong> {pacienteEncontrado.notificacionRiesgo}</p>
                                <p><strong>Hipertension Arterial:</strong> {pacienteEncontrado.hipertensionArterial}</p>
                                <p><strong>Medicacion Prescripción:</strong> {pacienteEncontrado.medicacionPrescripcion}</p>
                                <p><strong>Medicacion Dispensa:</strong> {pacienteEncontrado.medicacionDispensa}</p>
                                <p><strong>Tabaquismo:</strong> {pacienteEncontrado.tabaquismo}</p>
                                <p><strong>Laboratorio:</strong> {pacienteEncontrado.laboratorio}</p>


                                {/* Resto de datos del paciente... */}
                            </>
                        ) : (
                            <p>No se encontraron datos del paciente.</p>
                        )}
                    </div>
                    <div className="flex-1 bg-gray-100 p-4 rounded-md">
                        <h3 className="text-lg font-bold">Formulario de Registro:</h3>
                        <form className="w-full space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Ubicación:</label>
                            <select
                                name="ubicacion"
                                value={datosPaciente.ubicacion}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Seleccione una ubicación</option>
                                {hasCardiologoRole ? (
                                    // Mostrar todas las ubicaciones si es administrador
                                    ubicaciones.map(ubicacion => (
                                        <option key={ubicacion.id} value={ubicacion.nombre}>
                                            {ubicacion.nombre}
                                        </option>
                                    ))
                                ) : (
                                    // Mostrar solo la ubicación asignada al usuario normal
                                    <option key={user.ubicacion?.id} value={user.ubicacion?.nombre}>
                                        {user.ubicacion?.nombre}
                                    </option>
                                )}
                            </select>
                        </div>
                            {/* Cuil */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">CUIL o DNI:</label>
                                <input
                                    type="text" // Cambiado a texto para permitir más de 9 dígitos
                                    name="cuil"
                                    value={datosPaciente.cuil}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    style={{ appearance: 'none' }}
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>

                            {/* Edad */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Edad:</label>
                                <input
                                    type="number"
                                    name="edad"
                                    value={datosPaciente.edad}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Género */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Género:</label>
                                <div className="flex space-x-2">
                                    {['masculino', 'femenino'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`p-2 border rounded ${datosPaciente.genero === option ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                            onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, genero: option }))}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Diabetes */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Diabetes:</label>
                                <div className="flex space-x-2">
                                    {['Sí', 'No'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, diabetes: option })}
                                            className={`p-2 border rounded-md ${datosPaciente.diabetes === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fumador */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Es fumador?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['sí', 'no'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, fumador: option })}
                                            className={`p-2 border rounded-md ${datosPaciente.fumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Presión Arterial */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Presión Arterial sistólica:</label>
                                <input
                                    type="number"
                                    name="presionArterial"
                                    value={datosPaciente.presionArterial}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    style={{ appearance: 'none' }}
                                />
                            </div>

                            {/* Peso */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Peso (kg):</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={datosPaciente.peso}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Talla */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Talla (cm):</label>
                                <input
                                    type="number"
                                    name="talla"
                                    value={datosPaciente.talla}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Hipertenso */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Es hipertenso o toma medicamentos para la hipertension?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['Sí', 'No'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, hipertenso: option })}
                                            className={`p-2 border rounded-md ${datosPaciente.hipertenso === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Infarto */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Ha tenido un infarto?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['Sí', 'No'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, infarto: option })}
                                            className={`p-2 border rounded-md ${datosPaciente.infarto === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ACV */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Ha tenido un ACV?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['Sí', 'No'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, acv: option })}
                                            className={`p-2 border rounded-md ${datosPaciente.acv === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Enfermedad Renal Cronica */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Renal Crónica?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['Sí', 'No'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setDatosPaciente({ ...datosPaciente, renal : option })}
                                            className={`p-2 border rounded-md ${datosPaciente.renal === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colesterol */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">¿Conoce su nivel de colesterol?</label>
                                <div className="flex space-x-2 mb-2">
                                    {['si', 'no'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => manejarSeleccionColesterol(option)}
                                            className={`p-2 border rounded-md ${nivelColesterolConocido === (option === 'si') ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                {nivelColesterolConocido === true && (
                                    <input
                                        type="number"
                                        name="colesterol"
                                        value={datosPaciente.colesterol === 'No' ? '' : datosPaciente.colesterol}
                                        onChange={manejarCambio}
                                        className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        style={{ appearance: 'none' }}
                                    />
                                )}
                            </div>
                            <button type="button" onClick={calcularRiesgo} className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                                Calcular Riesgo
                            </button>
                        </form>
                    </div>
                </div>
                )}
            </div>
        )}

        {/* Modal Resultados */}
        {mostrarModal && !modalAdvertencia && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
                <div className="flex justify-between mb-4">
                    {/* Botón Agregar Medicamento */}
                    <button
                    onClick={toggleModalMedicamentos}
                    className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                    SIGIPSA
                    </button>
                    {/* Botón Guardar Paciente */}
                    <button
                    onClick={guardarPaciente}
                    className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                    Guardar Paciente
                    </button>
                </div>
                
                <p><strong>Edad:</strong> {datosPaciente.edad}</p>
                <p><strong>Género:</strong> {datosPaciente.genero}</p>
                <p><strong>Diabetes:</strong> {datosPaciente.diabetes}</p>
                <p><strong>Fumador:</strong> {datosPaciente.fumador}</p>
                <p><strong>Presión Arterial:</strong> {datosPaciente.presionArterial}</p>
                <p><strong>Colesterol:</strong> {datosPaciente.colesterol || 'No especificado'}</p>
                <p><strong>Peso:</strong> {datosPaciente.peso || 'No especificado'}</p>
                <p><strong>Talla:</strong> {datosPaciente.talla || 'No especificada'} cm</p>
                <p><strong>IMC:</strong> {datosPaciente.imc || 'No calculado'}</p>
                <p><strong>Ubicación:</strong> {datosPaciente.ubicacion}</p>
                <p><strong>Fecha de Registro:</strong> {datosPaciente.fechaRegistro}</p>
                <p><strong>Hipertenso:</strong> {datosPaciente.hipertenso}</p>
                <p><strong>Infarto:</strong> {datosPaciente.infarto}</p>
                <p><strong>ACV:</strong> {datosPaciente.acv}</p>
                <p><strong>Nivel de Riesgo:</strong></p>
                <div className="mb-4">
                    {renderRiesgoGrid(nivelRiesgo)}
                </div>

                <button
                    onClick={cerrarModal}
                    className="absolute top-4 right-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Cerrar
                </button>
                </div>
            </div>
            )}

            {/* Modal para agregar medicamentos */}
            {mostrarModalMedicamentos && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-11/12 max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">SIGIPSA</h2>
                        <div className="mb-4 max-h-60 overflow-y-auto">
                            <h3 className="text-lg font-semibold mt-4 mb-2">NOTIFICACION DE RIESGO</h3>
                            {listaNotificacionRiesgo.map((medicamento, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={medicamento}
                                        onChange={(e) => handleMedicamentoChange('notificacionRiesgo', e)}
                                    />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                            
                            <h3 className="text-lg font-semibold mt-4 mb-2">HIPERTENSION ARTERIAL</h3>
                            {listaHipertensionArterial.map((medicamento, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={medicamento}
                                        onChange={(e) => handleMedicamentoChange('hipertensionArterial', e)}
                                    />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                            
                            <h3 className="text-lg font-semibold mt-4 mb-2">MEDICACION PRESCRIPCION</h3>
                            {listaMedicacionPrescripcion.map((medicamento, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={medicamento}
                                        onChange={(e) => handleMedicamentoChange('medicacionPrescripcion', e)}
                                    />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}

                            <h3 className="text-lg font-semibold mt-4 mb-2">MEDICACION DISPENSA</h3>
                            {listaMedicacionDispensa.map((medicamento, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={medicamento}
                                        onChange={(e) => handleMedicamentoChange('medicacionDispensa', e)}
                                    />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}

                            <h3 className="text-lg font-semibold mt-4 mb-2">TABAQUISMO</h3>
                            {listaTabaquismo.map((medicamento, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={medicamento}
                                        onChange={(e) => handleMedicamentoChange('tabaquismo', e)}
                                    />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}

                            <h3 className="text-lg font-semibold mt-4 mb-2">LABORATORIO</h3>
                            {listaLaboratorio.map((medicamento, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        value={medicamento}
                                        onChange={(e) => handleMedicamentoChange('laboratorio', e)}
                                    />
                                    <label className="ml-2">{medicamento}</label>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={guardarMedicamentos}
                            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={cerrarModal}
                            className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md">
                    {mensajeExito}
                </div>
            )}

            {/* Modal Advertencia */}
            {modalAdvertencia && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-11/12 max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">Recomendaciones</h2>
                        <div className="overflow-y-auto max-h-80">
                            <pre className="whitespace-pre-wrap text-left">{modalAdvertencia}</pre>
                        </div>
                        <button
                            onClick={cerrarModal}
                            className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
    </div>
    );
};

export default Formulario;
