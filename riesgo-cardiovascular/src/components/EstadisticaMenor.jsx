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
      <p><strong>Hipertenso:</strong> {paciente.hipertenso ? 'Sí' : 'No'}</p>
      <p><strong>Diabetes:</strong> {paciente.diabetes ? 'Sí' : 'No'}</p>
      <p><strong>Asma:</strong> {paciente.asma ? 'Sí' : 'No'}</p>
      <p><strong>Fuma:</strong> {paciente.fuma ? 'Sí' : 'No'}</p>
      <p><strong>Antecedentes de Soplo:</strong> {paciente.antecedentesSoplo ? 'Sí' : 'No'}</p>
      <p><strong>Arritmias:</strong> {paciente.arritmias ? 'Sí' : 'No'}</p>
      <p><strong>Enfermedad Crónica:</strong> {paciente.enfermedadCronica ? 'Sí' : 'No'}</p>
      <p><strong>Cirugía Previa:</strong> {paciente.cirugiaPrevia ? 'Sí' : 'No'}</p>
      <p><strong>Alergias:</strong> {paciente.alergias || 'No tiene'}</p>
      <p><strong>Antecedentes Familiares de Marcapaso:</strong> {paciente.antecedentesFamiliaresMarcapaso ? 'Sí' : 'No'}</p>
      <p><strong>Desfibriladores:</strong> {paciente.desfibriladores ? 'Sí' : 'No'}</p>
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
    // Aquí puedes tomar el token de tu localStorage, contexto, o donde lo guardes
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

    // Obtener pacientes desde la API
    axios.get('/api/pacientemenor', config)
      .then(response => {
        setPacientes(response.data); // Asumimos que la respuesta es un array de pacientes
        setLoading(false);
      })
      .catch(err => {
        setError('Error al obtener pacientes');
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Estadísticas de Pacientes Menores</h1>
      <div className="pacientes-container">
        {pacientes.length === 0 ? (
          <p>No hay pacientes registrados</p>
        ) : (
          pacientes.map((paciente) => (
            <TarjetaPaciente key={paciente.dni} paciente={paciente} />
          ))
        )}
      </div>
    </div>
  );
};

export default EstadisticaMenor;
