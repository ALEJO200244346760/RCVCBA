import { useState } from "react";
import { bloodPressureData } from "./sara";

// Función para encontrar la talla más cercana en la tabla
const findClosestHeight = (data, age, height) => {
    const filteredByAge = data.filter((entry) => entry.age === age);
    if (!filteredByAge.length) return null; // Si no hay datos para la edad, devolvemos null
  
    return filteredByAge.reduce((prev, curr) =>
      Math.abs(curr.height - height) < Math.abs(prev.height - height) ? curr : prev
    );
  };
  
  const getPercentile = (data, value, type) => {
    let percentile = 50; // Por defecto
  
    for (let i = 0; i < data.length; i++) {
      const referenceValue = type === "systolic" ? data[i].systolic : data[i].diastolic;
  
      if (value >= referenceValue) {
        percentile = data[i].percentile;
      } else {
        break; // Detener cuando encontramos el límite
      }
    }
  
    return percentile;
  };

// Calcula el percentil de presión arterial
const calculatePercentile = ({ age, height, gender, systolic, diastolic }) => {
    const systolicDataset = bloodPressureData[`${gender}-systolic`];
    const diastolicDataset = bloodPressureData[`${gender}-diastolic`];
  
    if (!systolicDataset || !diastolicDataset) return { error: "Datos de presión arterial no disponibles." };
  
    const closestSystolic = findClosestHeight(systolicDataset, age, height);
    const closestDiastolic = findClosestHeight(diastolicDataset, age, height);
  
    if (!closestSystolic || !closestDiastolic) return { error: "Datos no encontrados en la tabla" };
  
    const systolicPercentile = getPercentile(
      systolicDataset.filter((entry) => entry.height === closestSystolic.height),
      systolic,
      "systolic"
    );
  
    const diastolicPercentile = getPercentile(
      diastolicDataset.filter((entry) => entry.height === closestDiastolic.height),
      diastolic,
      "diastolic"
    );
  
    const highestPercentile = Math.max(systolicPercentile, diastolicPercentile);
  
    const riskLevel =
      highestPercentile >= 95 ? "Hipertensión" :
      highestPercentile >= 90 ? "Prehipertensión" :
      "Normal";
  
    return {
      systolicPercentile,
      diastolicPercentile,
      highestPercentile,
      riskLevel,
    };
  };  

const FormularioPaciente = () => {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    gender: "male",
    systolic: "",
    diastolic: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculation = calculatePercentile(formData);
    setResult(calculation);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Calculadora de Presión Arterial</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Edad (años):</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Talla (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Género:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Presión Sistólica (mmHg):</label>
          <input
            type="number"
            name="systolic"
            value={formData.systolic}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Presión Diastólica (mmHg):</label>
          <input
            type="number"
            name="diastolic"
            value={formData.diastolic}
            onChange={handleChange}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Calcular Percentil
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${result.riskLevel === "Hipertensión" ? 'bg-red-100 text-red-700' : result.riskLevel === "Prehipertensión" ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {result.error ? (
            <p className="text-center text-lg font-medium">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Resultados:</h2>
              <p className="text-lg">Percentil Sistólico: <span className="font-semibold">{result.systolicPercentile}</span></p>
              <p className="text-lg">Percentil Diastólico: <span className="font-semibold">{result.diastolicPercentile}</span></p>
              <h3 className="text-xl font-semibold mt-4">Riesgo: <span className="text-lg font-medium">{result.riskLevel}</span></h3>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FormularioPaciente;