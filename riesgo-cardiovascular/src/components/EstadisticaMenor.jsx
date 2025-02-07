import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Componente de tarjeta para mostrar los detalles de cada paciente
const TarjetaPaciente = ({ paciente }) => {
  return (
    <div className="tarjeta-paciente">
      <h3>Paciente: {paciente.dni}</h3>
      <p><strong>Género:</strong> {paciente.genero}</p>
      <p><strong>Peso:</strong> {paciente.peso} kg</p>
      <p><strong>Talla:</strong> {paciente.talla} cm</p>
      <p><strong>Tensión Arterial:</strong> {paciente.tensionArterial}</p>
      <p><strong>Hipertenso:</strong> {paciente.hipertenso === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Diabetes:</strong> {paciente.diabetes === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Asma:</strong> {paciente.asma === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Fuma:</strong> {paciente.fuma === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Antecedentes de Soplo:</strong> {paciente.antecedentesSoplo === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Arritmias:</strong> {paciente.arritmias === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Enfermedad Crónica:</strong> {paciente.enfermedadCronica === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Cirugía Previa:</strong> {paciente.cirugiaPrevia === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Alergias:</strong> {paciente.alergias === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Antecedentes Familiares de Marcapaso:</strong> {paciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Desfibriladores:</strong> {paciente.desfibriladores === 'Sí' ? 'Sí' : 'No'}</p>
      <p><strong>Tensión Arterial Máxima:</strong> {paciente.tensionArterialMaxima}</p>
      <p><strong>Tensión Arterial Mínima:</strong> {paciente.tensionArterialMinima}</p>
      <p><strong>Electrocardiograma:</strong> {paciente.electrocardiograma || 'No disponible'}</p>
    </div>
  );
};

const EstadisticaMenor = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Traer el token de autenticación
  const getToken = () => {
    return localStorage.getItem('token'); // Asegúrate de que el token esté guardado
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Redirige si no tienes un token
      navigate('/login');
      return;
    }

    // Configurar headers para la solicitud de la API
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Realizar la solicitud a la API
    axios.get('/api/pacientemenor', config) // Cambié la URL aquí
      .then(response => {
        console.log('Respuesta de la API:', response); // Verifica toda la respuesta (encabezados, datos)

        // Verificar si el tipo de contenido es JSON
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          console.error('La respuesta no es JSON:', response);
          setError('La respuesta no es JSON');
          return;
        }

        // Verifica si la respuesta es un arreglo
        if (Array.isArray(response.data)) {
          setPacientes(response.data);
        } else {
          setError('La respuesta de la API no es un arreglo');
          console.error('La respuesta de la API no es un arreglo:', response.data);
        }
      })
      .catch(err => {
        console.error('Error al obtener pacientes:', err);
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Error desconocido'}`);
        } else if (err.request) {
          setError('No se recibió respuesta del servidor');
        } else {
          setError(`Error al configurar la solicitud: ${err.message}`);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Si está cargando, muestra el mensaje de carga
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si hay un error, muestra el mensaje de error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Estadísticas de Pacientes Menores</h1>
      <div className="pacientes-container">
        {pacientes.length ? (
          pacientes.map((paciente) => (
            <TarjetaPaciente key={paciente.dni} paciente={paciente} />
          ))
        ) : (
          <p>No hay pacientes registrados</p>
        )}
      </div>
    </div>
  );
};

export default EstadisticaMenor;
