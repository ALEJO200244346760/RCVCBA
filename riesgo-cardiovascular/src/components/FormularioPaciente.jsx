import { bloodPressureData } from "./sara";

console.log("📊 Datos originales:", bloodPressureData);
console.log("📝 Claves disponibles:", Object.keys(bloodPressureData));

const testAge = 1;
const testHeight = 77.2;
const systolicDataset = bloodPressureData["male-systolic"];
const diastolicDataset = bloodPressureData["male-diastolic"];

console.log("📝 Datos de presión sistólica:", systolicDataset);
console.log("📝 Datos de presión diastólica:", diastolicDataset);

// Filtrar por edad
const filteredSystolic = systolicDataset.filter((entry) => entry.age === testAge);
const filteredDiastolic = diastolicDataset.filter((entry) => entry.age === testAge);

console.log("🎯 Datos sistólicos filtrados por edad:", filteredSystolic);
console.log("🎯 Datos diastólicos filtrados por edad:", filteredDiastolic);
