import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Producto, "id">>({
    nombre: "",
    categoria: "",
    precio: 0,
    stock: 0,
  });

  useEffect(() => {
    api.get("/productos").then((res) => setProductos(res.data));
  }, []);

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post("/productos", nuevo);
    setProductos([...productos, res.data]);
    setNuevo({ nombre: "", categoria: "", precio: 0, stock: 0 });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Gestión de Productos
      </h1>

      <form
        onSubmit={crearProducto}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) =>
              setNuevo({ ...nuevo, nombre: e.target.value })
            }
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Categoría"
            value={nuevo.categoria}
            onChange={(e) =>
              setNuevo({ ...nuevo, categoria: e.target.value })
            }
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevo.precio}
            onChange={(e) =>
              setNuevo({ ...nuevo, precio: parseFloat(e.target.value) })
            }
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={nuevo.stock}
            onChange={(e) =>
              setNuevo({ ...nuevo, stock: parseInt(e.target.value) })
            }
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">Lista de productos</h2>
      <ul className="list-disc list-inside text-gray-700">
        {productos.map((p) => (
          <li key={p.id}>
            {p.nombre} | {p.categoria} | Q{p.precio} | Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
