import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EstadisticaMenor = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Llamar al API para obtener los pacientes menores
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('/api/pacientemenor'); // Suponiendo que el endpoint para obtener los pacientes está en esta ruta
        const data = response.data;

        // Verificar si la respuesta es un array
        if (Array.isArray(data)) {
          setPacientes(data); // Asignar solo si es un array
        } else {
          throw new Error('La respuesta no es un array');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pacientes.length > 0 ? (
        pacientes.map((paciente) => (
          <div
            key={paciente.dni}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            {/* Foto de avatar usando el nombre */}
            <img
              src={`https://ui-avatars.com/api/?name=${paciente.dni}&background=random`}
              alt={paciente.dni}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-center">{paciente.dni}</h3>
            <p className="text-sm text-gray-600">Género: {paciente.genero}</p>
            <p className="text-sm text-gray-600">Peso: {paciente.peso} kg</p>
            <p className="text-sm text-gray-600">Talla: {paciente.talla} cm</p>
            <p className="text-sm text-gray-600">Tensión Arterial: {paciente.tensionArterial} mmHg</p>
            <p className="text-sm text-gray-600">Hipertenso: {paciente.hipertenso ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Diabetes: {paciente.diabetes ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Asma: {paciente.asma ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Fuma: {paciente.fuma ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Antecedentes Soplo: {paciente.antecedentesSoplo ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Arritmias: {paciente.arritmias ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Enfermedad Crónica: {paciente.enfermedadCronica ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Cirugía Previa: {paciente.cirugiaPrevia ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Alergias: {paciente.alergias ? paciente.alergias : 'No'}</p>
            <p className="text-sm text-gray-600">Antecedentes Familiares Marcapaso: {paciente.antecedentesFamiliaresMarcapaso ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Desfibriladores: {paciente.desfibriladores ? 'Sí' : 'No'}</p>
            <p className="text-sm text-gray-600">Tensión Arterial Máxima: {paciente.tensionArterialMaxima} mmHg</p>
            <p className="text-sm text-gray-600">Tensión Arterial Mínima: {paciente.tensionArterialMinima} mmHg</p>
            <p className="text-sm text-gray-600">Electrocardiograma: {paciente.electrocardiograma ? 'Normal' : 'Anómalo'}</p>
          </div>
        ))
      ) : (
        <p>No hay pacientes registrados.</p>
      )}
    </div>
  );
};

export default EstadisticaMenor;
