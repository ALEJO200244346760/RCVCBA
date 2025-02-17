import { useState } from "react";

// Datos de referencia para percentiles de presión arterial
const bloodPressureData = {
  male: [
    { age: 1, height: 77, systolic: 90, diastolic: 50, percentile: 50 },
    { age: 1, height: 80, systolic: 95, diastolic: 53, percentile: 90 },
    { age: 2, height: 85, systolic: 96, diastolic: 55, percentile: 50 },
    { age: 2, height: 90, systolic: 102, diastolic: 58, percentile: 90 },
    { age: 3, height: 95, systolic: 98, diastolic: 56, percentile: 50 },
    { age: 3, height: 100, systolic: 105, diastolic: 60, percentile: 90 },
  ],
  female: [
    { age: 1, height: 76, systolic: 88, diastolic: 48, percentile: 50 },
    { age: 1, height: 79, systolic: 94, diastolic: 52, percentile: 90 },
    { age: 2, height: 84, systolic: 92, diastolic: 54, percentile: 50 },
    { age: 2, height: 89, systolic: 100, diastolic: 57, percentile: 90 },
    { age: 3, height: 94, systolic: 97, diastolic: 55, percentile: 50 },
    { age: 3, height: 99, systolic: 104, diastolic: 59, percentile: 90 },
  ],
};

// Función para encontrar la talla más cercana en la tabla
const findClosestHeight = (data, age, height) => {
  const ageFiltered = data.filter((entry) => entry.age == age);
  if (!ageFiltered.length) return null;

  return ageFiltered.reduce((prev, curr) =>
    Math.abs(curr.height - height) < Math.abs(prev.height - height) ? curr : prev
  );
};

// Calcula el percentil de presión arterial
const calculatePercentile = ({ age, height, gender, systolic, diastolic }) => {
  const dataset = bloodPressureData[gender];
  const closest = findClosestHeight(dataset, age, height);

  if (!closest) return { error: "Datos no encontrados en la tabla" };

  let systolicPercentile = systolic >= closest.systolic ? "≥90" : "50";
  let diastolicPercentile = diastolic >= closest.diastolic ? "≥90" : "50";

  return {
    systolicPercentile,
    diastolicPercentile,
    riskLevel:
      systolic >= closest.systolic + 12 || diastolic >= closest.diastolic + 12
        ? "Hipertensión"
        : systolic >= closest.systolic + 6 || diastolic >= closest.diastolic + 6
        ? "Prehipertensión"
        : "Normal",
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
