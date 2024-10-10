import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  listaNotificacionRiesgo,
  listaHipertensionArterial,
  listaMedicacionPrescripcion,
  listaMedicacionDispensa,
  listaTabaquismo,
  listaLaboratorio
} from './ConstFormulario';


export const DatosPacienteInicial = {
    cuil: '',
    telefono: '',
    edad: '',
    genero: '',
    diabetes: '',
    fumador: '',
    presionArterial: '',
    colesterol: '',
    peso: '',
    talla: '',
    cintura: '',
    fechaRegistro: new Date().toISOString().split('T')[0],
    imc: '',
    hipertenso: '',
    infarto: '',
    acv: '',
    renal: '',
    doctor: '',
    notificacionRiesgo: [],
    hipertensionArterial: [],
    medicacionPrescripcion: [],
    medicacionDispensa: [],
    tabaquismo: [],
    laboratorio: []
};

function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DatosPacienteInicial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/pacientes/${id}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos del paciente:', error);
        setLoading(false);
      });
  }, [id]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const manejarCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const currentList = prev[name];
      if (checked) {
        return { ...prev, [name]: [...currentList, value] };
      } else {
        return { ...prev, [name]: currentList.filter(item => item !== value) };
      }
    });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/pacientes/${id}`, formData)
      .then(() => {
        navigate('/estadisticas'); // Redirige a la página de estadísticas después de guardar
      })
      .catch(error => console.error('Error al actualizar el paciente:', error));
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>
      <form onSubmit={manejarSubmit} className="space-y-4">
        {/* Campos de texto */}
        {Object.keys(DatosPacienteInicial).filter(key => 
          !Array.isArray(DatosPacienteInicial[key])
        ).map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={manejarCambio}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}

        {/* Campos de listas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notificación de Riesgo</label>
          {listaNotificacionRiesgo.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="notificacionRiesgo"
                value={item}
                checked={formData.notificacionRiesgo.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hipertensión Arterial</label>
          {listaHipertensionArterial.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="hipertensionArterial"
                value={item}
                checked={formData.hipertensionArterial.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medicacion Prescripcion</label>
          {  listaMedicacionPrescripcion.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="medicacionPrescripcion"
                value={item}
                checked={formData.medicacionPrescripcion.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medicacion dispensa</label>
          {listaMedicacionDispensa.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="medicacionDispensa"
                value={item}
                checked={formData.medicacionDispensa.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tabaquismo</label>
          {listaTabaquismo.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="tabaquismo"
                value={item}
                checked={formData.tabaquismo.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Laboratorio</label>
          {listaLaboratorio.map(item => (
            <div key={item}>
              <input
                type="checkbox"
                name="laboratorio"
                value={item}
                checked={formData.laboratorio.includes(item)}
                onChange={manejarCheckboxChange}
              />
              {item}
            </div>
          ))}
        </div>


        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditarPaciente;