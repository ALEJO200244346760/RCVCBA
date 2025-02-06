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
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Respuesta de la API:', response.data); // Para inspeccionar la respuesta

        const data = response.data;

        // Verificamos si la respuesta es un array válido y contiene elementos
        if (Array.isArray(data) && data.length > 0) {
          setPacientes(data);
        } else {
          throw new Error('La respuesta no contiene un array válido de pacientes o está vacío');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [token]);

  const toggleDetalles = (id) => {
    setMostrarDetalles((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
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
      {pacientes.slice().reverse().map((paciente) => (
        <div key={paciente.dni} className="bg-white shadow-md rounded-lg p-4">
          {/* Datos siempre visibles */}
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">DNI:</div>
            <div className="text-sm text-gray-500">{paciente.dni || 'No disponible'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Género:</div>
            <div className="text-sm text-gray-500">{paciente.genero || 'No disponible'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Peso:</div>
            <div className="text-sm text-gray-500">{paciente.peso || 'No disponible'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Talla:</div>
            <div className="text-sm text-gray-500">{paciente.talla || 'No disponible'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Tensión Arterial:</div>
            <div className="text-sm text-gray-500">{paciente.tensionArterial || 'No disponible'}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Hipertenso:</div>
            <div className="text-sm text-gray-500">
              {paciente.hipertenso !== undefined ? (paciente.hipertenso ? 'Sí' : 'No') : 'No disponible'}
            </div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Diabetes:</div>
            <div className="text-sm text-gray-500">
              {paciente.diabetes !== undefined ? (paciente.diabetes ? 'Sí' : 'No') : 'No disponible'}
            </div>
          </div>

          {/* Mostrar detalles adicionales solo si están activados */}
          {mostrarDetalles[paciente.dni] && (
            <div className="mt-2">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Asma:</div>
                <div className="text-sm text-gray-500">{paciente.asma || 'No disponible'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Fuma:</div>
                <div className="text-sm text-gray-500">{paciente.fuma || 'No disponible'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Arritmias:</div>
                <div className="text-sm text-gray-500">{paciente.arritmias || 'No disponible'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Cirugía Previa:</div>
                <div className="text-sm text-gray-500">{paciente.cirugiaPrevia || 'No disponible'}</div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Alergias:</div>
                <div className="text-sm text-gray-500">{paciente.alergias || 'No disponible'}</div>
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
