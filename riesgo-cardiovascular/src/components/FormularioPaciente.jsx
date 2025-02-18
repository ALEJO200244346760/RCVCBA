import { useState } from "react";

// Datos de referencia para percentiles de presión arterial, separados por sistólica y diastólica
const bloodPressureData = {
  "male-systolic": [
    { age: 1, height: 77, systolic: 85, percentile: 50 },
    { age: 1, height: 80, systolic: 88, percentile: 50 },
    { age: 1, height: 82, systolic: 90, percentile: 50 },
    { age: 1, height: 84, systolic: 95, percentile: 50 },
    { age: 1, height: 86, systolic: 98, percentile: 50 },
    { age: 1, height: 87.9, systolic: 100, percentile: 50 },
    { age: 1, height: 77, systolic: 98, percentile: 90 },
    { age: 1, height: 80, systolic: 101, percentile: 90 },
    { age: 1, height: 82, systolic: 104, percentile: 90 },
    { age: 1, height: 84, systolic: 107, percentile: 90 },
    { age: 1, height: 86, systolic: 110, percentile: 90 },
    { age: 1, height: 87.9, systolic: 114, percentile: 90 },
  ],
  "female-systolic": [
    { age: 1, height: 76, systolic: 83, percentile: 50 },
    { age: 1, height: 79, systolic: 86, percentile: 50 },
    { age: 1, height: 81, systolic: 89, percentile: 50 },
    { age: 1, height: 84, systolic: 92, percentile: 50 },
    { age: 1, height: 76, systolic: 95, percentile: 90 },
    { age: 1, height: 79, systolic: 98, percentile: 90 },
    { age: 1, height: 81, systolic: 101, percentile: 90 },
    { age: 1, height: 84, systolic: 104, percentile: 90 },
  ],
  "male-diastolic": [
    { age: 1, height: 77, diastolic: 40, percentile: 50 },
    { age: 1, height: 80, diastolic: 41, percentile: 50 },
    { age: 1, height: 82, diastolic: 42, percentile: 50 },
    { age: 1, height: 84, diastolic: 43, percentile: 50 },
    { age: 1, height: 86, diastolic: 44, percentile: 50 },
    { age: 1, height: 87.9, diastolic: 45, percentile: 50 },
    { age: 1, height: 77, diastolic: 52, percentile: 90 },
    { age: 1, height: 80, diastolic: 53, percentile: 90 },
    { age: 1, height: 82, diastolic: 54, percentile: 90 },
    { age: 1, height: 84, diastolic: 55, percentile: 90 },
    { age: 1, height: 86, diastolic: 56, percentile: 90 },
    { age: 1, height: 87.9, diastolic: 57, percentile: 90 },
  ],
  "female-diastolic": [
    { age: 1, height: 76, diastolic: 38, percentile: 50 },
    { age: 1, height: 79, diastolic: 40, percentile: 50 },
    { age: 1, height: 81, diastolic: 42, percentile: 50 },
    { age: 1, height: 84, diastolic: 44, percentile: 50 },
    { age: 1, height: 76, diastolic: 50, percentile: 90 },
    { age: 1, height: 79, diastolic: 52, percentile: 90 },
    { age: 1, height: 81, diastolic: 54, percentile: 90 },
    { age: 1, height: 84, diastolic: 56, percentile: 90 },
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
  const systolicDataset = bloodPressureData[`${gender}-systolic`];
  const diastolicDataset = bloodPressureData[`${gender}-diastolic`];
  
  const closestSystolic = findClosestHeight(systolicDataset, age, height);
  const closestDiastolic = findClosestHeight(diastolicDataset, age, height);

  if (!closestSystolic || !closestDiastolic) return { error: "Datos no encontrados en la tabla" };

  // Se toma el percentil más alto de ambos
  const systolicPercentile = systolic >= closestSystolic.systolic ? closestSystolic.percentile : 50;
  const diastolicPercentile = diastolic >= closestDiastolic.diastolic ? closestDiastolic.percentile : 50;
  const highestPercentile = Math.max(systolicPercentile, diastolicPercentile);

  // Determina el riesgo con el percentil más alto
  const riskLevel =
    systolic >= closestSystolic.systolic + 12 || diastolic >= closestDiastolic.diastolic + 12
      ? "Hipertensión"
      : systolic >= closestSystolic.systolic + 6 || diastolic >= closestDiastolic.diastolic + 6
      ? "Prehipertensión"
      : "Normal";

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
