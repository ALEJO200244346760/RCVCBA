import React, { useState } from 'react';

const percentilesSistolic = {
    1: { 50: 85, 90: 90, 95: 95, 9512: 102 },
    2: { 50: 88, 90: 93, 95: 98, 9512: 105 },
    3: { 50: 90, 90: 95, 95: 100, 9512: 110 },
    4: { 50: 92, 90: 97, 95: 102, 9512: 115 },
    5: { 50: 93, 90: 98, 95: 103, 9512: 118 },
    6: { 50: 94, 90: 99, 95: 105, 9512: 120 },
    7: { 50: 95, 90: 100, 95: 106, 9512: 122 },
    8: { 50: 96, 90: 101, 95: 107, 9512: 124 },
    9: { 50: 97, 90: 102, 95: 108, 9512: 126 },
    10: { 50: 98, 90: 103, 95: 109, 9512: 128 },
    11: { 50: 99, 90: 104, 95: 110, 9512: 130 },
    12: { 50: 100, 90: 105, 95: 111, 9512: 132 },
    13: { 50: 101, 90: 106, 95: 112, 9512: 134 },
    14: { 50: 102, 90: 107, 95: 113, 9512: 136 },
    15: { 50: 103, 90: 108, 95: 114, 9512: 138 },
    16: { 50: 104, 90: 109, 95: 115, 9512: 140 },
    17: { 50: 105, 90: 110, 95: 116, 9512: 142 },
    18: { 50: 106, 90: 111, 95: 117, 9512: 144 },
    19: { 50: 107, 90: 112, 95: 118, 9512: 146 },
    20: { 50: 108, 90: 113, 95: 119, 9512: 148 },
};

const percentilesSistolicFem = {
    1: { 50: 80, 90: 85, 95: 90, 9512: 98 },
    2: { 50: 85, 90: 90, 95: 95, 9512: 103 },
    3: { 50: 87, 90: 93, 95: 98, 9512: 106 },
    4: { 50: 89, 90: 94, 95: 99, 9512: 109 },
    5: { 50: 90, 90: 95, 95: 100, 9512: 112 },
    6: { 50: 91, 90: 96, 95: 101, 9512: 115 },
    7: { 50: 92, 90: 97, 95: 102, 9512: 118 },
    8: { 50: 93, 90: 98, 95: 103, 9512: 121 },
    9: { 50: 94, 90: 99, 95: 104, 9512: 124 },
    10: { 50: 95, 90: 100, 95: 105, 9512: 127 },
    11: { 50: 96, 90: 101, 95: 106, 9512: 130 },
    12: { 50: 97, 90: 102, 95: 107, 9512: 133 },
    13: { 50: 98, 90: 103, 95: 108, 9512: 136 },
    14: { 50: 99, 90: 104, 95: 109, 9512: 139 },
    15: { 50: 100, 90: 105, 95: 110, 9512: 142 },
    16: { 50: 101, 90: 106, 95: 111, 9512: 145 },
    17: { 50: 102, 90: 107, 95: 112, 9512: 148 },
    18: { 50: 103, 90: 108, 95: 113, 9512: 151 },
    19: { 50: 104, 90: 109, 95: 114, 9512: 154 },
    20: { 50: 105, 90: 110, 95: 115, 9512: 157 },
};


const FormularioPaciente = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState('masculino');
  const [result, setResult] = useState(null);

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  const handleSexChange = (e) => {
    setSex(e.target.value);
  };

  const calculatePercentile = () => {
    if (!age || !height) {
      alert("Por favor, ingresa todos los datos.");
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseInt(height);

    const percentile = findPercentile(ageNum, heightNum, sex);

    if (percentile) {
      setResult(`El percentil de presión arterial es: ${percentile}`);
    } else {
      setResult('No se encontraron datos para esta combinación de edad, talla y sexo.');
    }
  };

  const findPercentile = (age, height, sex) => {
    const percentiles = sex === 'masculino' ? percentilesSistolic : percentilesSistolicFem;
    const agePercentiles = percentiles[age];

    if (!agePercentiles) return null;

    if (height <= 50) return agePercentiles[50];
    if (height <= 90) return agePercentiles[90];
    if (height <= 95) return agePercentiles[95];
    return agePercentiles[9512];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Calculadora de Percentil de Presión Arterial</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="age">
            Edad (años):
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={handleAgeChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ingresa la edad"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="height">
            Talla en cm:
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={handleHeightChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ingresa la talla"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="sex">
            Sexo:
          </label>
          <select
            id="sex"
            value={sex}
            onChange={handleSexChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <button
          onClick={calculatePercentile}
          className="w-full py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition duration-300"
        >
          Calcular Percentil
        </button>

        {result && (
          <div className="mt-6 text-center text-lg text-gray-800 font-medium">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioPaciente;
