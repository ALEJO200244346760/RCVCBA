import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DatosPacienteInicial = {
  cuil: '',
  telefono: '',
  edad: '',
  genero: '',
  diabetes: '',
  fumador: '',
  presionArterial: '',
  taMin: '',
  colesterol: '',
  peso: '',
  talla: '',
  cintura: '',
  doctor: '',
  imc: '',
  nivelRiesgo: '',
  infarto: '',
  acv: '',
  renal: '',
  hipertenso: ''
};

function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datosPaciente, setDatosPaciente] = useState(DatosPacienteInicial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); // Asegúrate de que loading se establezca en true al iniciar la carga
    axios.get(`/api/pacientes/${id}`)
      .then(response => {
        console.log('Datos del paciente:', response.data); // Verifica los datos recibidos
        setDatosPaciente(response.data);
        calcularIMC(response.data);
        calcularRiesgo(response.data);
        setLoading(false); // Cambia loading a false solo después de procesar los datos
      })
      .catch(error => {
        console.error('Error al obtener los datos del paciente:', error);
        setLoading(false); // También establece loading en false en caso de error
      });
  }, [id]);
  

  const calcularIMC = (data) => {
    const peso = parseFloat(data.peso);
    const tallaCm = parseFloat(data.talla);
    if (peso && tallaCm) {
      const tallaM = tallaCm / 100; // Convertir a metros
      const imc = peso / (tallaM * tallaM);
      setDatosPaciente(prev => ({ ...prev, imc: imc.toFixed(2) }));
    }
  };

  const calcularRiesgo = (data) => {
    const { edad, genero, diabetes, fumador, presionArterial, colesterol, infarto, acv, renal } = data;

    // Lógica para calcular el nivel de riesgo (ajusta según sea necesario)
    let riesgo = "Bajo"; // Este es un ejemplo; ajusta según tu lógica
    if (infarto === "Sí" || acv === "Sí" || renal === "Sí") {
      riesgo = ">20% <30% Alto";
    } else if (parseInt(edad) > 50 && (diabetes === "Sí" || fumador === "Sí")) {
      riesgo = "Medio";
    }
    setDatosPaciente(prev => ({ ...prev, nivelRiesgo: riesgo }));
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosPaciente(prev => ({ ...prev, [name]: value }));
    
    // Recalcular IMC y riesgo si es necesario
    if (['peso', 'talla', 'edad', 'genero', 'diabetes', 'fumador', 'presionArterial', 'colesterol', 'infarto', 'acv', 'renal'].includes(name)) {
      calcularIMC({ ...datosPaciente, [name]: value });
      calcularRiesgo({ ...datosPaciente, [name]: value });
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/pacientes/${id}`, datosPaciente);
      navigate('/estadisticas');
    } catch (error) {
      setError('Error al actualizar el paciente.');
      console.error('Error al actualizar el paciente:', error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="flex-1 bg-gray-100 p-4 rounded-md">
      <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>
      <form onSubmit={manejarSubmit} className="w-full space-y-6">
        {/* Cuil */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">DNI:</label>
          <input
            type="text"
            name="cuil"
            value={datosPaciente.cuil}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Teléfono:</label>
          <input
            type="number"
            name="telefono"
            value={datosPaciente.telefono}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, genero: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, diabetes: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, fumador: option }))}
                className={`p-2 border rounded-md ${datosPaciente.fumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Hipertenso */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Es hipertenso?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setDatosPaciente(prev => ({ ...prev, hipertenso: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, infarto: option }))}
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
                onClick={() => setDatosPaciente(prev => ({ ...prev, acv: option }))}
                className={`p-2 border rounded-md ${datosPaciente.acv === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Enfermedad Renal Crónica */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Renal Crónica?</label>
          <div className="flex space-x-2 mb-2">
            {['Sí', 'No'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setDatosPaciente(prev => ({ ...prev, renal: option }))}
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
            {['sí', 'no'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setDatosPaciente(prev => ({ ...prev, colesterol: option === 'sí' ? '' : datosPaciente.colesterol }))}
                className={`p-2 border rounded-md ${datosPaciente.colesterol === (option === 'sí') ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {datosPaciente.colesterol === 'sí' && (
            <input
              type="number"
              name="colesterol"
              value={datosPaciente.colesterol === 'No' ? '' : datosPaciente.colesterol}
              onChange={manejarCambio}
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
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
          />
        </div>

        {/* Tensión Arterial Mínima */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">TA Min.:</label>
          <input
            type="number"
            name="taMin"
            value={datosPaciente.taMin}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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

        {/* Cintura */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Cintura (cm):</label>
          <input
            type="number"
            name="cintura"
            value={datosPaciente.cintura}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Doctor */}
        <div className="flex flex-col mt-4">
          <div className="flex justify-end space-x-2">
            {['doctor1', 'doctor2', 'doctor3'].map(doctor => (
              <button
                key={doctor}
                type="button"
                className={`p-2 border rounded ${datosPaciente.doctor === doctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setDatosPaciente(prev => ({ ...prev, doctor }))}
              >
                {doctor.charAt(0).toUpperCase() + doctor.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
          Guardar Cambios
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default EditarPaciente;
