import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Componente de tarjeta para mostrar los detalles de cada paciente
const TarjetaPaciente = ({ paciente }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:translate-y-[-5px]">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Paciente: {paciente.dni}</h3>
      <p className="text-gray-600"><strong>Género:</strong> {paciente.genero}</p>
      <p className="text-gray-600"><strong>Peso:</strong> {paciente.peso} kg</p>
      <p className="text-gray-600"><strong>Talla:</strong> {paciente.talla} cm</p>
      <p className="text-gray-600"><strong>Tensión Arterial:</strong> {paciente.tensionArterial}</p>
      <p className="text-gray-600"><strong>Hipertenso:</strong> {paciente.hipertenso === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Diabetes:</strong> {paciente.diabetes === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Asma:</strong> {paciente.asma === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Fuma:</strong> {paciente.fuma === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Antecedentes de Soplo:</strong> {paciente.antecedentesSoplo === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Arritmias:</strong> {paciente.arritmias === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Enfermedad Crónica:</strong> {paciente.enfermedadCronica === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Cirugía Previa:</strong> {paciente.cirugiaPrevia === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Alergias:</strong> {paciente.alergias === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Antecedentes Familiares de Marcapaso:</strong> {paciente.antecedentesFamiliaresMarcapaso === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Desfibriladores:</strong> {paciente.desfibriladores === 'Sí' ? 'Sí' : 'No'}</p>
      <p className="text-gray-600"><strong>Tensión Arterial Máxima:</strong> {paciente.tensionArterialMaxima}</p>
      <p className="text-gray-600"><strong>Tensión Arterial Mínima:</strong> {paciente.tensionArterialMinima}</p>
      <p className="text-gray-600"><strong>Electrocardiograma:</strong> {paciente.electrocardiograma || 'No disponible'}</p>
    </div>
  );
};

const EstadisticaMenor = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const apiBaseURL = 'https://rcvcba-production.up.railway.app';

    axios.get(`${apiBaseURL}/api/pacientemenor/pacmenor`, config)
      .then(response => {
        if (Array.isArray(response.data)) {
          setPacientes(response.data);
        } else {
          setError('La respuesta de la API no es un arreglo');
        }
      })
      .catch(err => {
        setError(`Error: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Estadísticas de Pacientes Menores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pacientes.length ? (
          pacientes.map((paciente) => (
            <TarjetaPaciente key={paciente.dni} paciente={paciente} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No hay pacientes registrados</p>
        )}
      </div>
    </div>
  );
};

export default EstadisticaMenor;
