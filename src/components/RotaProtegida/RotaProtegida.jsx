import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../services/IteraDiscService/IteraDiscServiceAuth";

function RotaProtegida({ apenasAdmin = false }) {
  const logado = AuthService.estaLogado();
  const perfil = AuthService.obterPerfil();

  if (!logado) {
    return <Navigate to="/login" replace />;
  }

  if (apenasAdmin && perfil !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default RotaProtegida;