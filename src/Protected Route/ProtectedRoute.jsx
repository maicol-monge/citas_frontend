import React from "react";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";

// rolesPermitidos: array de roles válidos para la ruta
const ProtectedRoute = ({ rolesPermitidos, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // No autenticado
    return <Navigate to="/" replace />;
  }

  if (!rolesPermitidos.includes(user.rol)) {
    // No tiene el rol requerido
    Swal.fire({
      title: "Acceso denegado",
      text: "No tienes permisos para acceder a esta página.",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
    return null; // No navega, solo muestra el mensaje y no renderiza el contenido
  }

  // Autenticado y con rol permitido
  return children;
};

export default ProtectedRoute;