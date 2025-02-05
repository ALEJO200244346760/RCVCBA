import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Estadisticas from './components/Estadisticas';
import Formulario from './components/Formulario';
import FormularioPaciente from './components/FormularioPaciente'; // Aquí importamos el componente FormularioPaciente
import FormularioPacienteMenor from './components/FormularioPacienteMenor'; // Importamos el nuevo formulario para pacientes menores
import EditarPaciente from './components/EditarPaciente';
import TomarPresion from './components/TomarPresion';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { token, roles } = useAuth();

  const isCardiologo = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGO');
  const isCardiologia = Array.isArray(roles) && roles.includes('ROLE_CARDIOLOGIA');
  const isNurse = Array.isArray(roles) && roles.includes('ENFERMERO');

  // Lógica para determinar a qué formulario ir
  const formularioRedirect = isCardiologo || isCardiologia ? "/formulario-paciente-menor" : "/formulario-paciente";

  return (
    <Router>
      <Header />
      <Routes>
        {/* Página principal es Formulario para todos */}
        <Route path="/" element={<Formulario />} />

        {/* Redirigir a FormularioPacienteMenor si el usuario tiene el rol adecuado */}
        <Route path="/formulario-paciente-menor" element={<FormularioPacienteMenor />} />
        <Route path="/formulario-paciente" element={<FormularioPaciente />} />

        <Route path="/tomarPresion" element={<TomarPresion />} />

        {/* Permitir acceso solo a CARDIOLOGO para Estadisticas */}
        <Route 
          path="/estadisticas" 
          element={
            <RoleProtectedRoute 
              element={<Estadisticas />} 
              allowedRoles={['ROLE_CARDIOLOGO']} 
            />
          } 
        />

        <Route
          path="/editar-paciente/:id"
          element={
            <RoleProtectedRoute
              element={<EditarPaciente />}
              allowedRoles={['ROLE_CARDIOLOGO']}
            />
          }
        />
        <Route
          path="/admin-panel"
          element={
            <RoleProtectedRoute
              element={<AdminPanel />}
              allowedRoles={['ROLE_CARDIOLOGO']}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to={formularioRedirect} />} />
      </Routes>
    </Router>
  );
}

export default App;
