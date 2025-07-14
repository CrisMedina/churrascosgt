import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Productos from './pages/Productos';
import Guarniciones from './pages/Guarniciones';
import Combos from './pages/Combos';
import Dulces from './pages/Dulces';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/guarniciones" element={<Guarniciones />} />
        <Route path="/combos" element={<Combos />} />
        <Route path="/dulces" element={<Dulces />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
