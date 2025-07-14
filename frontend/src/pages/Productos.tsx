import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Producto, 'id'>>({
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
  });

  useEffect(() => {
    api.get('/productos').then((res) => {
      setProductos(res.data);
    });
  }, []);

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/productos', nuevo);
    setProductos([...productos, res.data]);

    setNuevo({ nombre: '', categoria: '', precio: 0, stock: 0 });
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>

      <form onSubmit={crearProducto}>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoría"
          value={nuevo.categoria}
          onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: parseFloat(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevo.stock}
          onChange={(e) => setNuevo({ ...nuevo, stock: parseInt(e.target.value) })}
        />
        <button type="submit">Agregar</button>
      </form>

      <h3>Lista de productos</h3>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.nombre} | {p.categoria} | Q{p.precio} | Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
