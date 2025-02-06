import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Estadisticas from './components/Estadisticas';
import Formulario from './components/Formulario';
import FormularioPaciente from './components/FormularioPaciente';
import FormularioPacienteMenor from './components/FormularioPacienteMenor';
import EstadisticaMenor from './components/EstadisticaMenor';
import EditarPaciente from './components/EditarPaciente';
import TomarPresion from './components/TomarPresion';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { token, roles } = useAuth();

  // Verificamos si el usuario tiene ciertos roles
  const isCardiologo = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGO');
  const isCardiologia = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGIA');
  const isNurse = Array.isArray(roles) && roles.includes('ENFERMERO');

  // Si no hay token, redirige a la página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Página principal es Formulario para todos */}
        <Route path="/" element={<Formulario />} />

        {/* Rutas para Formularios de Pacientes */}
        <Route path="/formulario-paciente" element={<FormularioPaciente />} />
        <Route path="/formulario-paciente-menor" element={<FormularioPacienteMenor />} />

        {/* Ruta para EstadisticaMenor */}
        <Route path="/estadistica-menor" element={<EstadisticaMenor />} />

        <Route path="/tomarPresion" element={<TomarPresion />} />

        {/* Ruta protegida para Estadísticas solo para CARDIOLOGO */}
        <Route 
          path="/estadisticas" 
          element={
            <RoleProtectedRoute 
              element={<Estadisticas />} 
              allowedRoles={['ROLE_CARDIOLOGO']} 
            />
          } 
        />

        {/* Ruta protegida para editar pacientes */}
        <Route
          path="/editar-paciente/:id"
          element={
            <RoleProtectedRoute
              element={<EditarPaciente />}
              allowedRoles={['ROLE_CARDIOLOGO']}
            />
          }
        />

        {/* Ruta protegida para el panel de administrador */}
        <Route
          path="/admin-panel"
          element={
            <RoleProtectedRoute
              element={<AdminPanel />}
              allowedRoles={['ROLE_CARDIOLOGO']}
            />
          }
        />

        {/* Rutas para Login y Registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirección en caso de ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
