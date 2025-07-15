import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Guarniciones from "./pages/Guarniciones";
import Combos from "./pages/Combos";
import { useAuth } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";
import VistaDulces from './pages/VistaDulces';
import VistaComboEspecial from './pages/VistaComboEspecial';

//inventario
import Carnes from './pages/inventario/Carnes';
import Dulces from './pages/inventario/Dulces';

export default function App() {
  const { estaAutenticado } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />

      <Route
        path="/productos"
        element={
          <RutaProtegida>
            <Productos />
          </RutaProtegida>
        }
      />
      <Route
        path="/guarniciones"
        element={
          <RutaProtegida>
            <Guarniciones />
          </RutaProtegida>
        }
      />
      <Route
        path="/combos"
        element={
          <RutaProtegida>
            <Combos />
          </RutaProtegida>
        }
      />
      <Route
        path="/vista-dulces"
        element={
          <RutaProtegida>
            <VistaDulces  />
          </RutaProtegida>
        }
      />
      <Route
        path="/combos-especiales"
        element={
          <RutaProtegida>
            <VistaComboEspecial  />
          </RutaProtegida>
        }
      />
      <Route
        path="/dulces"
        element={
          <RutaProtegida>
            <Dulces  />
          </RutaProtegida>
        }
      />

      <Route path="/inventario/carnes" element={<Carnes />} />
      <Route path="/inventario/dulces" element={<Dulces />} />
      <Route path="/registro" 
      element={<Registro />} />

    </Routes>
  );
}
