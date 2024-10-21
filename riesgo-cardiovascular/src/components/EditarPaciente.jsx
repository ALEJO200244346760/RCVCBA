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
import { calcularRiesgoCardiovascular } from './Calculadora';

const DatosPacienteInicial = {
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
  laboratorio: [],
  nivelRiesgo: ''
};

function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DatosPacienteInicial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener datos del paciente al cargar el componente
  useEffect(() => {
    axios.get(`/api/pacientes/${id}`)
      .then(response => {
        const data = {
          ...DatosPacienteInicial,
          ...response.data,
          notificacionRiesgo: response.data.notificacionRiesgo || [],
          hipertensionArterial: response.data.hipertensionArterial || [],
          medicacionPrescripcion: response.data.medicacionPrescripcion || [],
          medicacionDispensa: response.data.medicacionDispensa || [],
          tabaquismo: response.data.tabaquismo || [],
          laboratorio: response.data.laboratorio || []
        };
        setFormData(data);
        calcularIMC(data);
        calcularRiesgo(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos del paciente:', error);
        setLoading(false);
      });
  }, [id]);

  // Calcular el IMC
  const calcularIMC = (data) => {
    const peso = parseFloat(data.peso);
    const tallaCm = parseFloat(data.talla);
    if (peso && tallaCm) {
      const tallaM = tallaCm / 100; // Convertir centímetros a metros
      const imc = peso / (tallaM * tallaM);
      setFormData(prev => ({ ...prev, imc: imc.toFixed(2) }));
    }
  };

  // Calcular riesgo cardiovascular
  const calcularRiesgo = (data) => {
    const { edad, genero, diabetes, fumador, presionArterial, colesterol, infarto, acv, renal } = data;

    if (infarto === "Sí" || acv === "Sí" || renal === "Sí") {
      setFormData(prev => ({ ...prev, nivelRiesgo: ">20% <30% Alto" }));
      return;
    }

    const edadAjustada = ajustarEdad(parseInt(edad, 10));
    const presionAjustada = ajustarPresionArterial(parseInt(presionArterial, 10));

    const nivelRiesgoCalculado = calcularRiesgoCardiovascular(edadAjustada, genero, diabetes, fumador, presionAjustada, colesterol);
    setFormData(prev => ({ ...prev, nivelRiesgo: nivelRiesgoCalculado }));
  };

  // Ajustar la edad según criterios establecidos
  const ajustarEdad = (edad) => {
    if (edad < 50) return 40;
    if (edad >= 50 && edad <= 59) return 50;
    if (edad >= 60 && edad <= 69) return 60;
    return 70;
  };

  // Ajustar la presión arterial según criterios establecidos
  const ajustarPresionArterial = (presion) => {
    if (presion < 140) return 120;
    if (presion >= 140 && presion <= 159) return 140;
    if (presion >= 160 && presion <= 179) return 160;
    return 180;
  };

  // Manejar cambios en los inputs del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || '',
    }));

    // Recalcular IMC y riesgo al cambiar datos relevantes
    if (['peso', 'talla', 'edad', 'genero', 'diabetes', 'fumador', 'presionArterial', 'colesterol', 'infarto', 'acv', 'renal'].includes(name)) {
      calcularIMC({ ...formData, [name]: value });
      calcularRiesgo({ ...formData, [name]: value });
    }
  };

  // Manejar cambios en checkboxes
  const manejarCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const currentList = prev[name] || []; // Asegurarse de que sea un arreglo
      if (checked) {
        return { ...prev, [name]: [...currentList, value] };
      } else {
        return { ...prev, [name]: currentList.filter(item => item !== value) };
      }
    });
  };

  // Validar campos del formulario
  const validarCampos = () => {
    const {
      edad,
      genero,
      cuil,
      diabetes,
      fumador,
      presionArterial,
      colesterol,
      hipertenso,
      acv,
      renal,
      infarto,
      peso,
      talla,
      cintura
    } = formData;

    if (!edad || !cuil || !peso || !talla || !cintura || !genero || !diabetes || !fumador || !presionArterial || !hipertenso || !acv || !renal || !infarto) {
      setError('Por favor, complete todos los campos obligatorios.');
      return false;
    }

    if (!cuil || cuil.length < 7) {
      setError('El CUIL o DNI debe tener al menos 7 dígitos.');
      return false;
    }
    if (!edad || edad < 1 || edad > 120) {
      setError('La edad debe estar entre 1 y 120 años.');
      return false;
    }
    if (!presionArterial || presionArterial < 80 || presionArterial > 250) {
      setError('La presión arterial debe estar entre 80 y 250.');
      return false;
    }
    if (formData.colesterol && (colesterol < 150 || colesterol > 400)) {
      setError('El colesterol debe estar entre 150 y 400.');
      return false;
    }

    setError('');
    return true;
  };

  // Manejar el envío del formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) {
      return;
    }

    axios.put(`/api/pacientes/${id}`, formData)
      .then(() => {
        navigate('/estadisticas');
      })
      .catch(error => console.error('Error al actualizar el paciente:', error));
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>
      <form onSubmit={manejarSubmit} className="space-y-4">
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
                className="mr-2"
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
          {listaMedicacionPrescripcion.map(item => (
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
          <label className="block text-sm font-medium text-gray-700">Medicacion Dispensa</label>
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
      {error && <p className="text-red-500">{error}</p>} {/* Mostrar errores */}
    </div>
  );
}

export default EditarPaciente;
