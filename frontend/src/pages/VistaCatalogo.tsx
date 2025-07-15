import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function VistaCatalogo() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-8">¿Qué deseas comprar hoy?</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/combo" className="border rounded-xl shadow hover:shadow-lg bg-white hover:bg-red-50 transition overflow-hidden">
            <img
              src="/catalogo-combo.jpg"
              alt="Combo de churrasco"
              className="h-40 w-full object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold mb-1">Armar combo de churrasco</h2>
              <p className="text-sm text-gray-600">Personaliza tipo de carne, cocción y guarniciones.</p>
            </div>
          </Link>

          <Link to="/vista-dulces" className="border rounded-xl shadow hover:shadow-lg bg-white hover:bg-red-50 transition overflow-hidden">
            <img
              src="/catalogo-dulces.jpg"
              alt="Dulces típicos"
              className="h-40 w-full object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold mb-1">Elegir dulces típicos</h2>
              <p className="text-sm text-gray-600">Selecciona por unidad o en cajas de 6, 12 o 24.</p>
            </div>
          </Link>

          <Link to="/combos-especiales" className="border rounded-xl shadow hover:shadow-lg bg-white hover:bg-red-50 transition overflow-hidden">
            <img
              src="/catalogo-combos-especiales.png"
              alt="Combos especiales"
              className="h-40 w-full object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold mb-1">Combos especiales</h2>
              <p className="text-sm text-gray-600">Paquetes predefinidos para eventos o familias.</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
