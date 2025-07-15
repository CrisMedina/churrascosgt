import { useEffect, useState } from "react";
import { api } from "../services/api";

interface DulceTipico {
  id: number;
  nombre: string;
  presentacion: string;
  cantidadDisponible: number;
  precio: number;
}

export default function Dulces() {
  const [dulces, setDulces] = useState<DulceTipico[]>([]);
  const [nuevo, setNuevo] = useState<Omit<DulceTipico, "id">>({
    nombre: "",
    presentacion: "",
    cantidadDisponible: 0,
    precio: 0,
  });

  useEffect(() => {
    api.get("/dulcetipicos").then((res) => setDulces(res.data));
  }, []);

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post("/dulcetipicos", nuevo);
    setDulces([...dulces, res.data]);
    setNuevo({ nombre: "", presentacion: "", cantidadDisponible: 0, precio: 0 });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Gestión de Dulces Típicos
      </h1>

      <form onSubmit={agregar} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Presentación"
          value={nuevo.presentacion}
          onChange={(e) => setNuevo({ ...nuevo, presentacion: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={nuevo.cantidadDisponible}
          onChange={(e) =>
            setNuevo({ ...nuevo, cantidadDisponible: parseInt(e.target.value) })
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) =>
            setNuevo({ ...nuevo, precio: parseFloat(e.target.value) })
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Agregar
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">Lista de dulces</h2>
      <ul className="list-disc list-inside text-gray-700">
        {dulces.map((d) => (
          <li key={d.id}>
            {d.nombre} – {d.presentacion} – Stock: {d.cantidadDisponible} – Q{d.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}
