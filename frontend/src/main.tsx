import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Productos from './pages/Productos';
import Guarniciones from './pages/Guarniciones';
import Combos from './pages/Combos';
import { AuthProvider } from "./context/AuthContext";
import './index.css';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import { ProveedorCarrito } from './context/CarritoContext'
import CatalogoProductos from './components/productos/CatalogoProductos';
import Carrito from './components/carrito/Carrito';
import VistaCatalogo from './pages/VistaCatalogo';
import VistaCarrito from './pages/VistaCarrito';
import VistaCombo from './pages/VistaCombo';
import VistaDulces from './pages/VistaDulces';
import VistaComboEspecial from './pages/VistaComboEspecial';
import { Toaster } from 'react-hot-toast';

//inventario
import Carnes from './pages/inventario/Carnes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ProveedorCarrito>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/guarniciones" element={<Guarniciones />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/catalogo" element={<VistaCatalogo />} />
          <Route path="/carrito" element={<VistaCarrito />} />
          <Route path="/combo" element={<VistaCombo />} />
          <Route path="/vista-dulces" element={<VistaDulces />} />
          <Route path="/combos-especiales" element={<VistaComboEspecial />} />

          <Route path="/inventario/carnes" element={<Carnes />} />
        </Routes>
      </AuthProvider>
      </ProveedorCarrito>
    </BrowserRouter>
  </React.StrictMode>,
);
