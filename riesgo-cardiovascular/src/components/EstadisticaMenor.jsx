import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthToken from '../hooks/useAuthToken'; // Asegúrate de importar el hook para acceder al token

const EstadisticaMenor = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState({});

  // Usamos el hook useAuthToken para obtener el token de autenticación
  const token = useAuthToken();

  useEffect(() => {

const fetchPacientes = async () => {
  try {
    const response = await axios.get('/api/pacientemenor', {
      headers: {
        Authorization: `Bearer ${token}`,  // Aquí estamos añadiendo el token correctamente
      }
    });
    const data = response.data;
    
    // Verificamos que la respuesta sea un array
    if (Array.isArray(data)) {
      setPacientes(data);
    } else {
      throw new Error('La respuesta no contiene un array válido de pacientes');
    }
  } catch (err) {
    setError(err.response ? err.response.data.message : err.message);
  } finally {
    setLoading(false);
  }
};


    fetchPacientes();
  }, [token]); // El efecto se ejecuta cada vez que el token cambia

  const toggleDetalles = (id) => {
    setMostrarDetalles((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pacientes.slice().reverse().map(paciente => (
        <div key={paciente.dni} className="bg-white shadow-md rounded-lg p-4">
          {/* Datos siempre visibles */}
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">DNI:</div>
            <div className="text-sm text-gray-500">{paciente.dni || 'null'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Género:</div>
            <div className="text-sm text-gray-500">{paciente.genero || 'null'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Peso:</div>
            <div className="text-sm text-gray-500">{paciente.peso || 'null'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Talla:</div>
            <div className="text-sm text-gray-500">{paciente.talla || 'null'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Tensión Arterial:</div>
            <div className="text-sm text-gray-500">{paciente.tensionArterial || 'null'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Hipertenso:</div>
            <div className="text-sm text-gray-500">{paciente.hipertenso !== undefined ? (paciente.hipertenso ? 'Sí' : 'No') : 'null'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Diabetes:</div>
            <div className="text-sm text-gray-500">{paciente.diabetes !== undefined ? (paciente.diabetes ? 'Sí' : 'No') : 'null'}</div>
          </div>

          {/* Mostrar detalles adicionales solo si están activados */}
          {mostrarDetalles[paciente.dni] && (
            <div className="mt-2">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Asma:</div>
                <div className="text-sm text-gray-500">{paciente.asma || 'null'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Fuma:</div>
                <div className="text-sm text-gray-500">{paciente.fuma || 'null'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Arritmias:</div>
                <div className="text-sm text-gray-500">{paciente.arritmias || 'null'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Cirugía Previa:</div>
                <div className="text-sm text-gray-500">{paciente.cirugiaPrevia || 'null'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Alergias:</div>
                <div className="text-sm text-gray-500">{paciente.alergias || 'null'}</div>
              </div>
            </div>
          )}

          {/* Botón "Mostrar más" o "Mostrar menos" */}
          <button onClick={() => toggleDetalles(paciente.dni)} className="text-indigo-600 hover:text-indigo-900 mt-2">
            {mostrarDetalles[paciente.dni] ? 'Mostrar menos' : 'Mostrar más'}
          </button>

        </div>
      ))}
    </div>
  );
};

export default EstadisticaMenor;
