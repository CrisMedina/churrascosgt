import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function RutaProtegida({ children }: Props) {
  const { estaAutenticado } = useAuth();

  return estaAutenticado ? children : <Navigate to="/login" />;
}
