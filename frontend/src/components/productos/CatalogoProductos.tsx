import { useEffect, useState } from 'react';
import { usarCarrito } from '../../context/CarritoContext';
import { obtenerProductos } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'churrasco' | 'dulce' | 'combo';
};

export default function CatalogoProductos() {
  const { token } = useAuth();
  const { despachar } = usarCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!token) return;
      try {
        const datos = await obtenerProductos(token);
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [token]);

  const agregarAlCarrito = (producto: Producto) => {
    despachar({ tipo: 'AGREGAR_PRODUCTO', payload: { ...producto, cantidad: 1 } });
  };

  if (cargando) return <p className="p-6">Cargando productos...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {productos.map((producto) => (
        <div key={producto.id} className="border rounded-2xl shadow p-4 bg-white hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">{producto.nombre}</h3>
          <p className="text-sm text-gray-600 mb-3">{producto.descripcion}</p>
          <p className="text-base font-semibold mb-3">Q{producto.precio.toFixed(2)}</p>
          <button
            onClick={() => agregarAlCarrito(producto)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}
