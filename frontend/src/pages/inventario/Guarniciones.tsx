import { useEffect, useState } from "react";


type Guarnicion = {
  id: number;
  nombre: string;
  unidadMedida: string;
  cantidad: string;
  precio: string;
};

export default function Guarniciones() {
  const [guarniciones, setGuarniciones] = useState<Guarnicion[]>([]);
  const [formulario, setFormulario] = useState<Omit<Guarnicion, "id">>({
    nombre: "",
    unidadMedida: "",
    cantidad: "",
    precio: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Simulación temporal
  useEffect(() => {
    setGuarniciones([
      { id: 1, nombre: "Papa", unidadMedida: "libras", cantidad: "10", precio: "2.00" },
      { id: 2, nombre: "Chirmol", unidadMedida: "onzas", cantidad: "20", precio: "1.50" },
    ]);
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo = {
      ...formulario,
      id: editandoId ?? Date.now(),
    };

    if (editandoId !== null) {
      setGuarniciones(prev => prev.map(g => g.id === editandoId ? nuevo : g));
    } else {
      setGuarniciones(prev => [...prev, nuevo]);
    }

    setFormulario({ nombre: "", unidadMedida: "", cantidad: "", precio: "" });
    setEditandoId(null);
  };

  const manejarEditar = (item: Guarnicion) => {
    setFormulario(item);
    setEditandoId(item.id);
  };

  const manejarEliminar = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este ingrediente?")) {
      setGuarniciones(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Ingredientes para guarniciones</h1>

      <form onSubmit={manejarSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej. Papa"
            value={formulario.nombre}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Unidad de medida</label>
          <input
            type="text"
            name="unidadMedida"
            placeholder="libras, unidades, etc."
            value={formulario.unidadMedida}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="text"
            name="cantidad"
            placeholder="Ej. 10"
            value={formulario.cantidad}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Precio (Q)</label>
          <input
            type="text"
            name="precio"
            placeholder="Ej. 2.50"
            value={formulario.precio}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            {editandoId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>

      <table className="w-full text-left border rounded shadow-sm overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Unidad</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {guarniciones.map(g => (
            <tr key={g.id} className="border-t">
              <td className="p-2">{g.nombre}</td>
              <td className="p-2">{g.unidadMedida}</td>
              <td className="p-2">{g.cantidad}</td>
              <td className="p-2">Q{g.precio}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => manejarEditar(g)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminar(g.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
