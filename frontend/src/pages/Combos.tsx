import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Combo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export default function Combos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Combo, "id">>({
    nombre: "",
    descripcion: "",
    precio: 0,
  });

  useEffect(() => {
    api.get("/combos").then((res) => setCombos(res.data));
  }, []);

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post("/combos", nuevo);
    setCombos([...combos, res.data]);
    setNuevo({ nombre: "", descripcion: "", precio: 0 });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Gestión de Combos
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
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: parseFloat(e.target.value) })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Agregar
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">Lista de combos</h2>
      <ul className="list-disc list-inside text-gray-700">
        {combos.map((c) => (
          <li key={c.id}>
            {c.nombre} – {c.descripcion} – Q{c.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}
