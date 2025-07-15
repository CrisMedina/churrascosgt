import { useEffect, useState } from 'react';
import { DulceTipico } from '../types/DulceTipico';
import { usarCarrito } from '../context/CarritoContext';
import { obtenerDulces } from '../services/api';
import { ProductoEnCarrito } from '../types/ProductoEnCarrito';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const presentaciones = [
  { tipo: 'unidad', label: 'Por unidad', cantidad: 1 },
  { tipo: 'caja6', label: 'Caja de 6', cantidad: 6 },
  { tipo: 'caja12', label: 'Caja de 12', cantidad: 12 },
  { tipo: 'caja24', label: 'Caja de 24', cantidad: 24 },
];

const obtenerImagenDulce = (nombre: string): string => {
  const nombreNormalizado = nombre.toLowerCase().replace(/\s+/g, '-');
  return `/dulces/${nombreNormalizado}.jpg`;
};

export default function VistaDulces() {
  const [dulces, setDulces] = useState<DulceTipico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccion, setSeleccion] = useState<Record<string, string>>({});
  const [idEdicion, setIdEdicion] = useState<string | null>(null);
  const { despachar } = usarCarrito();
  const { token } = useAuth();

  useEffect(() => {
    const cargar = async () => {
      try {
        if (!token) {
          console.warn('Token no disponible');
          return;
        }
        const lista = await obtenerDulces(token);
        setDulces(lista);
      } catch (error) {
        console.error('Error al cargar dulces', error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [token]);

  useEffect(() => {
    const editar = localStorage.getItem('dulceEditar');
    if (editar) {
      try {
        const dulce = JSON.parse(editar);
        setSeleccion({ [dulce.nombre]: dulce.presentacionTipo });
        setIdEdicion(dulce.id);
      } catch (e) {
        console.error('Error cargando dulce a editar:', e);
      }
      localStorage.removeItem('dulceEditar');
    }
  }, []);

  const manejarCambio = (id: string, valor: string) => {
    setSeleccion(prev => ({ ...prev, [id]: valor }));
  };

  const agregarAlCarrito = (dulce: DulceTipico) => {
    const tipoSeleccionado = seleccion[dulce.id];
    const presentacion = presentaciones.find(p => p.tipo === tipoSeleccionado);

    if (!presentacion) {
      toast.error('Selecciona una presentación');
      return;
    }

    const producto: ProductoEnCarrito = {
      id: idEdicion ?? `dulce-${dulce.id}-${Date.now()}`,
      nombre: `${dulce.nombre} (${presentacion.label})`,
      precio: dulce.precio * presentacion.cantidad,
      cantidad: 1,
      tipo: 'dulce'
    };

    despachar({
      tipo: idEdicion ? 'ACTUALIZAR_PRODUCTO' : 'AGREGAR_PRODUCTO',
      payload: producto,
    });

    toast.success(`${dulce.nombre} ${idEdicion ? 'editado' : 'agregado'} al carrito`);
    setIdEdicion(null);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Dulces típicos</h2>
        {cargando ? (
          <p>Cargando dulces...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dulces.map((dulce) => (
              <div
                key={dulce.id}
                className="bg-white border rounded-lg p-4 shadow flex flex-col justify-between"
              >
                <img
                  src={dulce.presentacion}
                  alt={dulce.presentacion}
                  className="h-40 w-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{dulce.nombre}</h3>
                  <p className="text-sm text-gray-600">Disponible: {dulce.cantidadDisponible}</p>
                  <p className="text-sm text-gray-700 font-bold mb-2">
                    Q{dulce.precio.toFixed(2)} por unidad
                  </p>
                  <select
                    value={seleccion[dulce.id] || ''}
                    onChange={e => manejarCambio(dulce.id.toString(), e.target.value)}
                    className="w-full mb-2 border rounded px-3 py-2"
                  >
                    <option value="">Selecciona presentación</option>
                    {presentaciones.map(p => (
                      <option key={p.tipo} value={p.tipo}>
                        {p.label} (Q{(p.cantidad * dulce.precio).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => agregarAlCarrito(dulce)}
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2"
                >
                  {idEdicion ? 'Guardar cambios' : 'Agregar al carrito'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
