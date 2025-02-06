import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthToken from '../hooks/useAuthToken'; // Asegúrate de importar el hook para acceder al token

const EstadisticaMenor = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState({});
  const [filtros, setFiltros] = useState({});

  // Usamos el hook useAuthToken para obtener el token de autenticación
  const token = useAuthToken();

  // Obtener pacientes menores
  useEffect(() => {
    const fetchPacientesMenores = async () => {
      try {
        const response = await axios.get('https://rcvcba.vercel.app/api/pacientemenor', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });

        // Verificar que la respuesta sea válida y contenga los datos
        if (response.data && Array.isArray(response.data)) {
          setPacientes(response.data);
        } else {
          throw new Error('La respuesta de la API no contiene pacientes');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientesMenores();
  }, [token]);

  // Función para manejar los cambios en los filtros
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value || '', // Maneja el valor vacío como cadena vacía
    }));
  };

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

  // Filtrar pacientes si es necesario (por ejemplo, por edad o nombre)
  const pacientesFiltrados = pacientes.filter(paciente => {
    // Aplica los filtros si están definidos
    return Object.keys(filtros).every(key => 
      paciente[key]?.toString().toLowerCase().includes(filtros[key]?.toString().toLowerCase())
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pacientesFiltrados.slice().reverse().map((paciente) => (
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

          {/* Mostrar detalles adicionales solo si están activados */}
          {mostrarDetalles[paciente.dni] && (
            <div className="mt-2">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">Asma:</div>
                <div className="text-sm text-gray-500">{paciente.asma || 'No disponible'}</div>
              </div>
              {/* Agregar otros detalles si es necesario */}
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
