import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Guarnicion {
  id: number;
  nombre: string;
  stock: number;
  esExtra: boolean;
}

export default function Guarniciones() {
  const [guarniciones, setGuarniciones] = useState<Guarnicion[]>([]);
  const [nueva, setNueva] = useState<Omit<Guarnicion, "id">>({
    nombre: "",
    stock: 0,
    esExtra: false,
  });

  useEffect(() => {
    api.get("/guarniciones").then((res) => setGuarniciones(res.data));
  }, []);

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post("/guarniciones", nueva);
    setGuarniciones([...guarniciones, res.data]);
    setNueva({ nombre: "", stock: 0, esExtra: false });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Gestión de Guarniciones
      </h1>

      <form onSubmit={agregar} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nueva.nombre}
          onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={nueva.stock}
          onChange={(e) => setNueva({ ...nueva, stock: parseInt(e.target.value) })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={nueva.esExtra}
            onChange={(e) => setNueva({ ...nueva, esExtra: e.target.checked })}
          />
          <span>¿Es extra?</span>
        </label>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Agregar
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">Lista de guarniciones</h2>
      <ul className="list-disc list-inside text-gray-700">
        {guarniciones.map((g) => (
          <li key={g.id}>
            {g.nombre} – Stock: {g.stock} {g.esExtra && "(Extra)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
