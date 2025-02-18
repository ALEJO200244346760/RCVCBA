import { useState } from "react";

// Datos de referencia para percentiles de presión arterial, separados por sistólica y diastólica
const bloodPressureData = {
  "male-systolic": [
    { age: 1, height: 77.2, systolic: 85, percentile: 50 },
    { age: 1, height: 77.2, systolic: 98, percentile: 90 },
    { age: 1, height: 77.2, systolic: 102, percentile: 95 },
    { age: 1, height: 77.2, systolic: 114, percentile: 9512 },
    { age: 1, height: 78.3, systolic: 85, percentile: 50 },
    { age: 1, height: 78.3, systolic: 99, percentile: 90 },
    { age: 1, height: 78.3, systolic: 102, percentile: 95 },
    { age: 1, height: 78.3, systolic: 114, percentile: 9512 },
    { age: 1, height: 80.2, systolic: 86, percentile: 50 },
    { age: 1, height: 80.2, systolic: 99, percentile: 90 },
    { age: 1, height: 80.2, systolic: 103, percentile: 95 },
    { age: 1, height: 80.2, systolic: 115, percentile: 9512 },
    { age: 1, height: 82.4, systolic: 86, percentile: 50 },
    { age: 1, height: 82.4, systolic: 100, percentile: 90 },
    { age: 1, height: 82.4, systolic: 103, percentile: 95 },
    { age: 1, height: 82.4, systolic: 115, percentile: 9512 },
    { age: 1, height: 84.6, systolic: 87, percentile: 50 },
    { age: 1, height: 84.6, systolic: 100, percentile: 90 },
    { age: 1, height: 84.6, systolic: 104, percentile: 95 },
    { age: 1, height: 84.6, systolic: 116, percentile: 9512 },
    { age: 1, height: 86.7, systolic: 88, percentile: 50 },
    { age: 1, height: 86.7, systolic: 101, percentile: 90 },
    { age: 1, height: 86.7, systolic: 105, percentile: 95 },
    { age: 1, height: 86.7, systolic: 117, percentile: 9512 },
    { age: 1, height: 87.9, systolic: 88, percentile: 50 },
    { age: 1, height: 87.9, systolic: 101, percentile: 90 },
    { age: 1, height: 87.9, systolic: 105, percentile: 95 },
    { age: 1, height: 87.9, systolic: 117, percentile: 9512 },
    { age: 2, height: 86.1, systolic: 87, percentile: 50 },
    { age: 2, height: 86.1, systolic: 100, percentile: 90 },
    { age: 2, height: 86.1, systolic: 104, percentile: 95 },
    { age: 2, height: 86.1, systolic: 116, percentile: 9512 },
    { age: 2, height: 87.4, systolic: 87, percentile: 50 },
    { age: 2, height: 87.4, systolic: 100, percentile: 90 },
    { age: 2, height: 87.4, systolic: 105, percentile: 95 },
    { age: 2, height: 87.4, systolic: 117, percentile: 9512 },
    { age: 2, height: 89.6, systolic: 88, percentile: 50 },
    { age: 2, height: 89.6, systolic: 101, percentile: 90 },
    { age: 2, height: 89.6, systolic: 105, percentile: 95 },
    { age: 2, height: 89.6, systolic: 117, percentile: 9512 },
    { age: 2, height: 92.1, systolic: 89, percentile: 50 },
    { age: 2, height: 92.1, systolic: 102, percentile: 90 },
    { age: 2, height: 92.1, systolic: 106, percentile: 95 },
    { age: 2, height: 92.1, systolic: 118, percentile: 9512 },
    { age: 2, height: 94.7, systolic: 89, percentile: 50 },
    { age: 2, height: 94.7, systolic: 103, percentile: 90 },
    { age: 2, height: 94.7, systolic: 107, percentile: 95 },
    { age: 2, height: 94.7, systolic: 119, percentile: 9512 },
    { age: 2, height: 97.1, systolic: 90, percentile: 50 },
    { age: 2, height: 97.1, systolic: 103, percentile: 90 },
    { age: 2, height: 97.1, systolic: 107, percentile: 95 },
    { age: 2, height: 97.1, systolic: 119, percentile: 9512 },
    { age: 2, height: 98.5, systolic: 91, percentile: 50 },
    { age: 2, height: 98.5, systolic: 104, percentile: 90 },
    { age: 2, height: 98.5, systolic: 108, percentile: 95 },
    { age: 2, height: 98.5, systolic: 120, percentile: 9512 },
    { age: 3, height: 92.5, systolic: 88, percentile: 50 },
    { age: 3, height: 92.5, systolic: 101, percentile: 90 },
    { age: 3, height: 92.5, systolic: 106, percentile: 95 },
    { age: 3, height: 92.5, systolic: 118, percentile: 9512 },
    { age: 3, height: 93.9, systolic: 89, percentile: 50 },
    { age: 3, height: 93.9, systolic: 102, percentile: 90 },
    { age: 3, height: 93.9, systolic: 106, percentile: 95 },
    { age: 3, height: 93.9, systolic: 118, percentile: 9512 },
    { age: 3, height: 96.3, systolic: 89, percentile: 50 },
    { age: 3, height: 96.3, systolic: 102, percentile: 90 },
    { age: 3, height: 96.3, systolic: 107, percentile: 95 },
    { age: 3, height: 96.3, systolic: 119, percentile: 9512 },
    { age: 3, height: 99, systolic: 90, percentile: 50 },
    { age: 3, height: 99, systolic: 103, percentile: 90 },
    { age: 3, height: 99, systolic: 107, percentile: 95 },
    { age: 3, height: 99, systolic: 119, percentile: 9512 },
    { age: 3, height: 101.8, systolic: 91, percentile: 50 },
    { age: 3, height: 101.8, systolic: 104, percentile: 90 },
    { age: 3, height: 101.8, systolic: 108, percentile: 95 },
    { age: 3, height: 101.8, systolic: 120, percentile: 9512 },
    { age: 3, height: 104.3, systolic: 92, percentile: 50 },
    { age: 3, height: 104.3, systolic: 105, percentile: 90 },
    { age: 3, height: 104.3, systolic: 109, percentile: 95 },
    { age: 3, height: 104.3, systolic: 121, percentile: 9512 },
    { age: 3, height: 105.8, systolic: 92, percentile: 50 },
    { age: 3, height: 105.8, systolic: 105, percentile: 90 },
    { age: 3, height: 105.8, systolic: 109, percentile: 95 },
    { age: 3, height: 105.8, systolic: 121, percentile: 9512 },
    { age: 4, height: 98.5, systolic: 90, percentile: 50 },
    { age: 4, height: 98.5, systolic: 102, percentile: 90 },
    { age: 4, height: 98.5, systolic: 107, percentile: 95 },
    { age: 4, height: 98.5, systolic: 119, percentile: 9512 },
    { age: 4, height: 100.2, systolic: 90, percentile: 50 },
    { age: 4, height: 100.2, systolic: 103, percentile: 90 },
    { age: 4, height: 100.2, systolic: 107, percentile: 95 },
    { age: 4, height: 100.2, systolic: 119, percentile: 9512 },
    { age: 4, height: 102.9, systolic: 91, percentile: 50 },
    { age: 4, height: 102.9, systolic: 104, percentile: 90 },
    { age: 4, height: 102.9, systolic: 108, percentile: 95 },
    { age: 4, height: 102.9, systolic: 120, percentile: 9512 },
    { age: 4, height: 105.9, systolic: 92, percentile: 50 },
    { age: 4, height: 105.9, systolic: 105, percentile: 90 },
    { age: 4, height: 105.9, systolic: 108, percentile: 95 },
    { age: 4, height: 105.9, systolic: 120, percentile: 9512 },
    { age: 4, height: 108.9, systolic: 93, percentile: 50 },
    { age: 4, height: 108.9, systolic: 105, percentile: 90 },
    { age: 4, height: 108.9, systolic: 109, percentile: 95 },
    { age: 4, height: 108.9, systolic: 121, percentile: 9512 },
    { age: 4, height: 111.5, systolic: 94, percentile: 50 },
    { age: 4, height: 111.5, systolic: 106, percentile: 90 },
    { age: 4, height: 111.5, systolic: 110, percentile: 95 },
    { age: 4, height: 111.5, systolic: 122, percentile: 9512 },
    { age: 4, height: 113.2, systolic: 94, percentile: 50 },
    { age: 4, height: 113.2, systolic: 107, percentile: 90 },
    { age: 4, height: 113.2, systolic: 110, percentile: 95 },
    { age: 4, height: 113.2, systolic: 122, percentile: 9512 },
    { age: 5, height: 104.4, systolic: 91, percentile: 50 },
    { age: 5, height: 104.4, systolic: 103, percentile: 90 },
    { age: 5, height: 104.4, systolic: 107, percentile: 95 },
    { age: 5, height: 104.4, systolic: 119, percentile: 9512 },
    { age: 5, height: 106.2, systolic: 92, percentile: 50 },
    { age: 5, height: 106.2, systolic: 104, percentile: 90 },
    { age: 5, height: 106.2, systolic: 108, percentile: 95 },
    { age: 5, height: 106.2, systolic: 120, percentile: 9512 },
    { age: 5, height: 109.1, systolic: 93, percentile: 50 },
    { age: 5, height: 109.1, systolic: 105, percentile: 90 },
    { age: 5, height: 109.1, systolic: 109, percentile: 95 },
    { age: 5, height: 109.1, systolic: 121, percentile: 9512 },
    { age: 5, height: 112.4, systolic: 94, percentile: 50 },
    { age: 5, height: 112.4, systolic: 106, percentile: 90 },
    { age: 5, height: 112.4, systolic: 109, percentile: 95 },
    { age: 5, height: 112.4, systolic: 121, percentile: 9512 },
    { age: 5, height: 115.7, systolic: 95, percentile: 50 },
    { age: 5, height: 115.7, systolic: 107, percentile: 90 },
    { age: 5, height: 115.7, systolic: 110, percentile: 95 },
    { age: 5, height: 115.7, systolic: 122, percentile: 9512 },
    { age: 5, height: 118.6, systolic: 96, percentile: 50 },
    { age: 5, height: 118.6, systolic: 108, percentile: 90 },
    { age: 5, height: 118.6, systolic: 111, percentile: 95 },
    { age: 5, height: 118.6, systolic: 123, percentile: 9512 },
    { age: 5, height: 120.3, systolic: 96, percentile: 50 },
    { age: 5, height: 120.3, systolic: 108, percentile: 90 },
    { age: 5, height: 120.3, systolic: 112, percentile: 95 },
    { age: 5, height: 120.3, systolic: 124, percentile: 9512 },
    { age: 6, height: 110.3, systolic: 93, percentile: 50 },
    { age: 6, height: 110.3, systolic: 105, percentile: 90 },
    { age: 6, height: 110.3, systolic: 108, percentile: 95 },
    { age: 6, height: 110.3, systolic: 120, percentile: 9512 },
    { age: 6, height: 112.2, systolic: 93, percentile: 50 },
    { age: 6, height: 112.2, systolic: 105, percentile: 90 },
    { age: 6, height: 112.2, systolic: 109, percentile: 95 },
    { age: 6, height: 112.2, systolic: 121, percentile: 9512 },
    { age: 6, height: 115.3, systolic: 94, percentile: 50 },
    { age: 6, height: 115.3, systolic: 106, percentile: 90 },
    { age: 6, height: 115.3, systolic: 110, percentile: 95 },
    { age: 6, height: 115.3, systolic: 122, percentile: 9512 },
    { age: 6, height: 118.9, systolic: 95, percentile: 50 },
    { age: 6, height: 118.9, systolic: 107, percentile: 90 },
    { age: 6, height: 118.9, systolic: 111, percentile: 95 },
    { age: 6, height: 118.9, systolic: 123, percentile: 9512 },
    { age: 6, height: 122.4, systolic: 96, percentile: 50 },
    { age: 6, height: 122.4, systolic: 109, percentile: 90 },
    { age: 6, height: 122.4, systolic: 112, percentile: 95 },
    { age: 6, height: 122.4, systolic: 124, percentile: 9512 },
    { age: 6, height: 125.6, systolic: 97, percentile: 50 },
    { age: 6, height: 125.6, systolic: 110, percentile: 90 },
    { age: 6, height: 125.6, systolic: 113, percentile: 95 },
    { age: 6, height: 125.6, systolic: 125, percentile: 9512 },
    { age: 6, height: 127.5, systolic: 98, percentile: 50 },
    { age: 6, height: 127.5, systolic: 110, percentile: 90 },
    { age: 6, height: 127.5, systolic: 114, percentile: 95 },
    { age: 6, height: 127.5, systolic: 126, percentile: 9512 },
    { age: 7, height: 116.1, systolic: 94, percentile: 50 },
    { age: 7, height: 116.1, systolic: 106, percentile: 90 },
    { age: 7, height: 116.1, systolic: 110, percentile: 95 },
    { age: 7, height: 116.1, systolic: 122, percentile: 9512 },
    { age: 7, height: 118, systolic: 94, percentile: 50 },
    { age: 7, height: 118, systolic: 107, percentile: 90 },
    { age: 7, height: 118, systolic: 110, percentile: 95 },
    { age: 7, height: 118, systolic: 122, percentile: 9512 },
    { age: 7, height: 121.4, systolic: 95, percentile: 50 },
    { age: 7, height: 121.4, systolic: 108, percentile: 90 },
    { age: 7, height: 121.4, systolic: 111, percentile: 95 },
    { age: 7, height: 121.4, systolic: 123, percentile: 9512 },
    { age: 7, height: 125.1, systolic: 97, percentile: 50 },
    { age: 7, height: 125.1, systolic: 109, percentile: 90 },
    { age: 7, height: 125.1, systolic: 112, percentile: 95 },
    { age: 7, height: 125.1, systolic: 124, percentile: 9512 },
    { age: 7, height: 128.9, systolic: 98, percentile: 50 },
    { age: 7, height: 128.9, systolic: 110, percentile: 90 },
    { age: 7, height: 128.9, systolic: 114, percentile: 95 },
    { age: 7, height: 128.9, systolic: 126, percentile: 9512 },
    { age: 7, height: 132.4, systolic: 98, percentile: 50 },
    { age: 7, height: 132.4, systolic: 111, percentile: 90 },
    { age: 7, height: 132.4, systolic: 115, percentile: 95 },
    { age: 7, height: 132.4, systolic: 127, percentile: 9512 },
    { age: 7, height: 134.5, systolic: 99, percentile: 50 },
    { age: 7, height: 134.5, systolic: 111, percentile: 90 },
    { age: 7, height: 134.5, systolic: 116, percentile: 95 },
    { age: 7, height: 134.5, systolic: 128, percentile: 9512 },
    { age: 8, height: 121.4, systolic: 95, percentile: 50 },
    { age: 8, height: 121.4, systolic: 107, percentile: 90 },
    { age: 8, height: 121.4, systolic: 111, percentile: 95 },
    { age: 8, height: 121.4, systolic: 123, percentile: 9512 },
    { age: 8, height: 123.5, systolic: 96, percentile: 50 },
    { age: 8, height: 123.5, systolic: 108, percentile: 90 },
    { age: 8, height: 123.5, systolic: 112, percentile: 95 },
    { age: 8, height: 123.5, systolic: 124, percentile: 9512 },
    { age: 8, height: 127, systolic: 97, percentile: 50 },
    { age: 8, height: 127, systolic: 109, percentile: 90 },
    { age: 8, height: 127, systolic: 112, percentile: 95 },
    { age: 8, height: 127, systolic: 124, percentile: 9512 },
    { age: 8, height: 131, systolic: 98, percentile: 50 },
    { age: 8, height: 131, systolic: 110, percentile: 90 },
    { age: 8, height: 131, systolic: 114, percentile: 95 },
    { age: 8, height: 131, systolic: 126, percentile: 9512 },
    { age: 8, height: 135.1, systolic: 99, percentile: 50 },
    { age: 8, height: 135.1, systolic: 111, percentile: 90 },
    { age: 8, height: 135.1, systolic: 115, percentile: 95 },
    { age: 8, height: 135.1, systolic: 127, percentile: 9512 },
    { age: 8, height: 138.8, systolic: 99, percentile: 50 },
    { age: 8, height: 138.8, systolic: 112, percentile: 90 },
    { age: 8, height: 138.8, systolic: 116, percentile: 95 },
    { age: 8, height: 138.8, systolic: 128, percentile: 9512 },
    { age: 8, height: 141, systolic: 100, percentile: 50 },
    { age: 8, height: 141, systolic: 112, percentile: 90 },
    { age: 8, height: 141, systolic: 117, percentile: 95 },
    { age: 8, height: 141, systolic: 129, percentile: 9512 },
    { age: 9, height: 126, systolic: 96, percentile: 50 },
    { age: 9, height: 126, systolic: 107, percentile: 90 },
    { age: 9, height: 126, systolic: 112, percentile: 95 },
    { age: 9, height: 126, systolic: 124, percentile: 9512 },
    { age: 9, height: 128.3, systolic: 97, percentile: 50 },
    { age: 9, height: 128.3, systolic: 108, percentile: 90 },
    { age: 9, height: 128.3, systolic: 112, percentile: 95 },
    { age: 9, height: 128.3, systolic: 124, percentile: 9512 },
    { age: 9, height: 132.1, systolic: 98, percentile: 50 },
    { age: 9, height: 132.1, systolic: 109, percentile: 90 },
    { age: 9, height: 132.1, systolic: 113, percentile: 95 },
    { age: 9, height: 132.1, systolic: 125, percentile: 9512 },
    { age: 9, height: 136.3, systolic: 99, percentile: 50 },
    { age: 9, height: 136.3, systolic: 110, percentile: 90 },
    { age: 9, height: 136.3, systolic: 115, percentile: 95 },
    { age: 9, height: 136.3, systolic: 127, percentile: 9512 },
    { age: 9, height: 140.7, systolic: 100, percentile: 50 },
    { age: 9, height: 140.7, systolic: 112, percentile: 90 },
    { age: 9, height: 140.7, systolic: 116, percentile: 95 },
    { age: 9, height: 140.7, systolic: 128, percentile: 9512 },
    { age: 9, height: 144.7, systolic: 101, percentile: 50 },
    { age: 9, height: 144.7, systolic: 113, percentile: 90 },
    { age: 9, height: 144.7, systolic: 118, percentile: 95 },
    { age: 9, height: 144.7, systolic: 130, percentile: 9512 },
    { age: 9, height: 147.1, systolic: 101, percentile: 50 },
    { age: 9, height: 147.1, systolic: 114, percentile: 90 },
    { age: 9, height: 147.1, systolic: 119, percentile: 95 },
    { age: 9, height: 147.1, systolic: 131, percentile: 9512 },
    { age: 10, height: 130.2, systolic: 97, percentile: 50 },
    { age: 10, height: 130.2, systolic: 108, percentile: 90 },
    { age: 10, height: 130.2, systolic: 112, percentile: 95 },
    { age: 10, height: 130.2, systolic: 124, percentile: 9512 },
    { age: 10, height: 132.7, systolic: 98, percentile: 50 },
    { age: 10, height: 132.7, systolic: 109, percentile: 90 },
    { age: 10, height: 132.7, systolic: 113, percentile: 95 },
    { age: 10, height: 132.7, systolic: 125, percentile: 9512 },
    { age: 10, height: 136.7, systolic: 99, percentile: 50 },
    { age: 10, height: 136.7, systolic: 111, percentile: 90 },
    { age: 10, height: 136.7, systolic: 114, percentile: 95 },
    { age: 10, height: 136.7, systolic: 126, percentile: 9512 },
    { age: 10, height: 141.3, systolic: 100, percentile: 50 },
    { age: 10, height: 141.3, systolic: 112, percentile: 90 },
    { age: 10, height: 141.3, systolic: 116, percentile: 95 },
    { age: 10, height: 141.3, systolic: 128, percentile: 9512 },
    { age: 10, height: 145.9, systolic: 101, percentile: 50 },
    { age: 10, height: 145.9, systolic: 113, percentile: 90 },
    { age: 10, height: 145.9, systolic: 118, percentile: 95 },
    { age: 10, height: 145.9, systolic: 130, percentile: 9512 },
    { age: 10, height: 150.1, systolic: 102, percentile: 50 },
    { age: 10, height: 150.1, systolic: 115, percentile: 90 },
    { age: 10, height: 150.1, systolic: 120, percentile: 95 },
    { age: 10, height: 150.1, systolic: 132, percentile: 9512 },
    { age: 10, height: 152.7, systolic: 103, percentile: 50 },
    { age: 10, height: 152.7, systolic: 116, percentile: 90 },
    { age: 10, height: 152.7, systolic: 121, percentile: 95 },
    { age: 10, height: 152.7, systolic: 133, percentile: 9512 },
    { age: 11, height: 134.7, systolic: 99, percentile: 50 },
    { age: 11, height: 134.7, systolic: 110, percentile: 90 },
    { age: 11, height: 134.7, systolic: 114, percentile: 95 },
    { age: 11, height: 134.7, systolic: 126, percentile: 9512 },
    { age: 11, height: 137.3, systolic: 99, percentile: 50 },
    { age: 11, height: 137.3, systolic: 111, percentile: 90 },
    { age: 11, height: 137.3, systolic: 114, percentile: 95 },
    { age: 11, height: 137.3, systolic: 126, percentile: 9512 },
    { age: 11, height: 141.5, systolic: 101, percentile: 50 },
    { age: 11, height: 141.5, systolic: 112, percentile: 90 },
    { age: 11, height: 141.5, systolic: 116, percentile: 95 },
    { age: 11, height: 141.5, systolic: 128, percentile: 9512 },
    { age: 11, height: 146.4, systolic: 102, percentile: 50 },
    { age: 11, height: 146.4, systolic: 114, percentile: 90 },
    { age: 11, height: 146.4, systolic: 118, percentile: 95 },
    { age: 11, height: 146.4, systolic: 130, percentile: 9512 },
    { age: 11, height: 151.3, systolic: 103, percentile: 50 },
    { age: 11, height: 151.3, systolic: 116, percentile: 90 },
    { age: 11, height: 151.3, systolic: 120, percentile: 95 },
    { age: 11, height: 151.3, systolic: 132, percentile: 9512 },
    { age: 11, height: 155.8, systolic: 104, percentile: 50 },
    { age: 11, height: 155.8, systolic: 117, percentile: 90 },
    { age: 11, height: 155.8, systolic: 123, percentile: 95 },
    { age: 11, height: 155.8, systolic: 135, percentile: 9512 },
    { age: 11, height: 158.6, systolic: 106, percentile: 50 },
    { age: 11, height: 158.6, systolic: 118, percentile: 90 },
    { age: 11, height: 158.6, systolic: 124, percentile: 95 },
    { age: 11, height: 158.6, systolic: 136, percentile: 9512 },
    { age: 12, height: 140.3, systolic: 101, percentile: 50 },
    { age: 12, height: 140.3, systolic: 113, percentile: 90 },
    { age: 12, height: 140.3, systolic: 116, percentile: 95 },
    { age: 12, height: 140.3, systolic: 128, percentile: 9512 },
    { age: 12, height: 143, systolic: 101, percentile: 50 },
    { age: 12, height: 143, systolic: 114, percentile: 90 },
    { age: 12, height: 143, systolic: 117, percentile: 95 },
    { age: 12, height: 143, systolic: 129, percentile: 9512 },
    { age: 12, height: 147.5, systolic: 102, percentile: 50 },
    { age: 12, height: 147.5, systolic: 115, percentile: 90 },
    { age: 12, height: 147.5, systolic: 118, percentile: 95 },
    { age: 12, height: 147.5, systolic: 130, percentile: 9512 },
    { age: 12, height: 152.7, systolic: 104, percentile: 50 },
    { age: 12, height: 152.7, systolic: 117, percentile: 90 },
    { age: 12, height: 152.7, systolic: 121, percentile: 95 },
    { age: 12, height: 152.7, systolic: 133, percentile: 9512 },
    { age: 12, height: 157.9, systolic: 106, percentile: 50 },
    { age: 12, height: 157.9, systolic: 119, percentile: 90 },
    { age: 12, height: 157.9, systolic: 124, percentile: 95 },
    { age: 12, height: 157.9, systolic: 136, percentile: 9512 },
    { age: 12, height: 162.6, systolic: 108, percentile: 50 },
    { age: 12, height: 162.6, systolic: 121, percentile: 90 },
    { age: 12, height: 162.6, systolic: 126, percentile: 95 },
    { age: 12, height: 162.6, systolic: 138, percentile: 9512 },
    { age: 12, height: 165.5, systolic: 109, percentile: 50 },
    { age: 12, height: 165.5, systolic: 122, percentile: 90 },
    { age: 12, height: 165.5, systolic: 128, percentile: 95 },
    { age: 12, height: 165.5, systolic: 140, percentile: 9512 },
    { age: 13, height: 147, systolic: 103, percentile: 50 },
    { age: 13, height: 147, systolic: 115, percentile: 90 },
    { age: 13, height: 147, systolic: 119, percentile: 95 },
    { age: 13, height: 147, systolic: 131, percentile: 9512 },
    { age: 13, height: 150, systolic: 104, percentile: 50 },
    { age: 13, height: 150, systolic: 116, percentile: 90 },
    { age: 13, height: 150, systolic: 120, percentile: 95 },
    { age: 13, height: 150, systolic: 132, percentile: 9512 },
    { age: 13, height: 154.9, systolic: 105, percentile: 50 },
    { age: 13, height: 154.9, systolic: 118, percentile: 90 },
    { age: 13, height: 154.9, systolic: 122, percentile: 95 },
    { age: 13, height: 154.9, systolic: 134, percentile: 9512 },
    { age: 13, height: 160.3, systolic: 108, percentile: 50 },
    { age: 13, height: 160.3, systolic: 121, percentile: 90 },
    { age: 13, height: 160.3, systolic: 125, percentile: 95 },
    { age: 13, height: 160.3, systolic: 137, percentile: 9512 },
    { age: 13, height: 165.7, systolic: 110, percentile: 50 },
    { age: 13, height: 165.7, systolic: 124, percentile: 90 },
    { age: 13, height: 165.7, systolic: 128, percentile: 95 },
    { age: 13, height: 165.7, systolic: 140, percentile: 9512 },
    { age: 13, height: 170.5, systolic: 111, percentile: 50 },
    { age: 13, height: 170.5, systolic: 126, percentile: 90 },
    { age: 13, height: 170.5, systolic: 130, percentile: 95 },
    { age: 13, height: 170.5, systolic: 142, percentile: 9512 },
    { age: 13, height: 173.4, systolic: 112, percentile: 50 },
    { age: 13, height: 173.4, systolic: 126, percentile: 90 },
    { age: 13, height: 173.4, systolic: 131, percentile: 95 },
    { age: 13, height: 173.4, systolic: 143, percentile: 9512 },
    { age: 14, height: 153.8, systolic: 105, percentile: 50 },
    { age: 14, height: 153.8, systolic: 119, percentile: 90 },
    { age: 14, height: 153.8, systolic: 123, percentile: 95 },
    { age: 14, height: 153.8, systolic: 135, percentile: 9512 },
    { age: 14, height: 156.9, systolic: 106, percentile: 50 },
    { age: 14, height: 156.9, systolic: 120, percentile: 90 },
    { age: 14, height: 156.9, systolic: 125, percentile: 95 },
    { age: 14, height: 156.9, systolic: 137, percentile: 9512 },
    { age: 14, height: 162, systolic: 109, percentile: 50 },
    { age: 14, height: 162, systolic: 123, percentile: 90 },
    { age: 14, height: 162, systolic: 127, percentile: 95 },
    { age: 14, height: 162, systolic: 139, percentile: 9512 },
    { age: 14, height: 167.5, systolic: 111, percentile: 50 },
    { age: 14, height: 167.5, systolic: 126, percentile: 90 },
    { age: 14, height: 167.5, systolic: 130, percentile: 95 },
    { age: 14, height: 167.5, systolic: 142, percentile: 9512 },
    { age: 14, height: 172.7, systolic: 112, percentile: 50 },
    { age: 14, height: 172.7, systolic: 127, percentile: 90 },
    { age: 14, height: 172.7, systolic: 132, percentile: 95 },
    { age: 14, height: 172.7, systolic: 144, percentile: 9512 },
    { age: 14, height: 177.4, systolic: 113, percentile: 50 },
    { age: 14, height: 177.4, systolic: 128, percentile: 90 },
    { age: 14, height: 177.4, systolic: 133, percentile: 95 },
    { age: 14, height: 177.4, systolic: 145, percentile: 9512 },
    { age: 14, height: 180.1, systolic: 113, percentile: 50 },
    { age: 14, height: 180.1, systolic: 129, percentile: 90 },
    { age: 14, height: 180.1, systolic: 134, percentile: 95 },
    { age: 14, height: 180.1, systolic: 146, percentile: 9512 },
    { age: 15, height: 159, systolic: 108, percentile: 50 },
    { age: 15, height: 159, systolic: 123, percentile: 90 },
    { age: 15, height: 159, systolic: 127, percentile: 95 },
    { age: 15, height: 159, systolic: 139, percentile: 9512 },
    { age: 15, height: 162, systolic: 110, percentile: 50 },
    { age: 15, height: 162, systolic: 124, percentile: 90 },
    { age: 15, height: 162, systolic: 129, percentile: 95 },
    { age: 15, height: 162, systolic: 141, percentile: 9512 },
    { age: 15, height: 166.9, systolic: 112, percentile: 50 },
    { age: 15, height: 166.9, systolic: 126, percentile: 90 },
    { age: 15, height: 166.9, systolic: 131, percentile: 95 },
    { age: 15, height: 166.9, systolic: 143, percentile: 9512 },
    { age: 15, height: 172.2, systolic: 113, percentile: 50 },
    { age: 15, height: 172.2, systolic: 128, percentile: 90 },
    { age: 15, height: 172.2, systolic: 132, percentile: 95 },
    { age: 15, height: 172.2, systolic: 144, percentile: 9512 },
    { age: 15, height: 177.2, systolic: 114, percentile: 50 },
    { age: 15, height: 177.2, systolic: 129, percentile: 90 },
    { age: 15, height: 177.2, systolic: 134, percentile: 95 },
    { age: 15, height: 177.2, systolic: 146, percentile: 9512 },
    { age: 15, height: 181.6, systolic: 114, percentile: 50 },
    { age: 15, height: 181.6, systolic: 130, percentile: 90 },
    { age: 15, height: 181.6, systolic: 135, percentile: 95 },
    { age: 15, height: 181.6, systolic: 147, percentile: 9512 },
    { age: 15, height: 184.2, systolic: 114, percentile: 50 },
    { age: 15, height: 184.2, systolic: 130, percentile: 90 },
    { age: 15, height: 184.2, systolic: 135, percentile: 95 },
    { age: 15, height: 184.2, systolic: 147, percentile: 9512 },
    { age: 16, height: 162.1, systolic: 111, percentile: 50 },
    { age: 16, height: 162.1, systolic: 126, percentile: 90 },
    { age: 16, height: 162.1, systolic: 130, percentile: 95 },
    { age: 16, height: 162.1, systolic: 142, percentile: 9512 },
    { age: 16, height: 165, systolic: 112, percentile: 50 },
    { age: 16, height: 165, systolic: 127, percentile: 90 },
    { age: 16, height: 165, systolic: 131, percentile: 95 },
    { age: 16, height: 165, systolic: 143, percentile: 9512 },
    { age: 16, height: 169.6, systolic: 114, percentile: 50 },
    { age: 16, height: 169.6, systolic: 128, percentile: 90 },
    { age: 16, height: 169.6, systolic: 133, percentile: 95 },
    { age: 16, height: 169.6, systolic: 145, percentile: 9512 },
    { age: 16, height: 174.6, systolic: 115, percentile: 50 },
    { age: 16, height: 174.6, systolic: 129, percentile: 90 },
    { age: 16, height: 174.6, systolic: 134, percentile: 95 },
    { age: 16, height: 174.6, systolic: 146, percentile: 9512 },
    { age: 16, height: 179.5, systolic: 115, percentile: 50 },
    { age: 16, height: 179.5, systolic: 131, percentile: 90 },
    { age: 16, height: 179.5, systolic: 135, percentile: 95 },
    { age: 16, height: 179.5, systolic: 147, percentile: 9512 },
    { age: 16, height: 183.8, systolic: 116, percentile: 50 },
    { age: 16, height: 183.8, systolic: 131, percentile: 90 },
    { age: 16, height: 183.8, systolic: 136, percentile: 95 },
    { age: 16, height: 183.8, systolic: 148, percentile: 9512 },
    { age: 16, height: 186.4, systolic: 116, percentile: 50 },
    { age: 16, height: 186.4, systolic: 132, percentile: 90 },
    { age: 16, height: 186.4, systolic: 137, percentile: 95 },
    { age: 16, height: 186.4, systolic: 149, percentile: 9512 },
    { age: 17, height: 163.8, systolic: 114, percentile: 50 },
    { age: 17, height: 163.8, systolic: 128, percentile: 90 },
    { age: 17, height: 163.8, systolic: 132, percentile: 95 },
    { age: 17, height: 163.8, systolic: 144, percentile: 9512 },
    { age: 17, height: 166.5, systolic: 115, percentile: 50 },
    { age: 17, height: 166.5, systolic: 129, percentile: 90 },
    { age: 17, height: 166.5, systolic: 133, percentile: 95 },
    { age: 17, height: 166.5, systolic: 145, percentile: 9512 },
    { age: 17, height: 170.9, systolic: 116, percentile: 50 },
    { age: 17, height: 170.9, systolic: 130, percentile: 90 },
    { age: 17, height: 170.9, systolic: 134, percentile: 95 },
    { age: 17, height: 170.9, systolic: 146, percentile: 9512 },
    { age: 17, height: 175.8, systolic: 117, percentile: 50 },
    { age: 17, height: 175.8, systolic: 131, percentile: 90 },
    { age: 17, height: 175.8, systolic: 135, percentile: 95 },
    { age: 17, height: 175.8, systolic: 147, percentile: 9512 },
    { age: 17, height: 180.7, systolic: 117, percentile: 50 },
    { age: 17, height: 180.7, systolic: 132, percentile: 90 },
    { age: 17, height: 180.7, systolic: 137, percentile: 95 },
    { age: 17, height: 180.7, systolic: 149, percentile: 9512 },
    { age: 17, height: 184.9, systolic: 118, percentile: 50 },
    { age: 17, height: 184.9, systolic: 133, percentile: 90 },
    { age: 17, height: 184.9, systolic: 138, percentile: 95 },
    { age: 17, height: 184.9, systolic: 150, percentile: 9512 },
    { age: 17, height: 187.5, systolic: 118, percentile: 50 },
    { age: 17, height: 187.5, systolic: 134, percentile: 90 },
    { age: 17, height: 187.5, systolic: 138, percentile: 95 },
    { age: 17, height: 187.5, systolic: 150, percentile: 9512 }

]
,
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
    { age: 1, height: 77, diastolic: 40, percentile: 90 },
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
