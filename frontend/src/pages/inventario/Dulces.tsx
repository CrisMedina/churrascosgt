import { useEffect, useState } from "react"; 
import Navbar from '../../components/Navbar';
import {
  obtenerDulces,
  crearDulce,
  actualizarDulce,
  eliminarDulce,
} from "../../services/api"; 

type Dulce = {
  id: number;
  nombre: string;
  cantidadUnidades: number;
  precioUnidad: number;
};

export default function Dulces() {
  const [dulces, setDulces] = useState<Dulce[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    cantidadUnidades: "",
    precioUnidad: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarDulces = async () => {
    try {
      const res = await obtenerDulces();
      setDulces(res.data);
    } catch (err) {
      console.error("Error al obtener dulces:", err);
    }
  };

  useEffect(() => {
    cargarDulces();
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const datos = {
      nombre: formulario.nombre,
      cantidadUnidades: Number(formulario.cantidadUnidades),
      precioUnidad: Number(formulario.precioUnidad),
    };

    try {
      if (editandoId !== null) {
        await actualizarDulce(editandoId, datos);
      } else {
        await crearDulce(datos);
      }
      await cargarDulces();
      setFormulario({
        nombre: "",
        cantidadUnidades: "",
        precioUnidad: "",
      });
      setEditandoId(null);
    } catch (err) {
      console.error("Error al guardar dulce:", err);
    }
  };

  const manejarEditar = (dulce: Dulce) => {
    setFormulario({
      nombre: dulce.nombre,
      cantidadUnidades: dulce.cantidadUnidades.toString(),
      precioUnidad: dulce.precioUnidad.toString(),
    });
    setEditandoId(dulce.id);
  };

  const manejarEliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este dulce?")) {
      try {
        await eliminarDulce(id);
        await cargarDulces();
      } catch (err) {
        console.error("Error al eliminar dulce:", err);
      }
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Dulces por unidad</h1>

      <form onSubmit={manejarSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="nombre" className="mb-1 text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Ej. Galleta artesanal"
            value={formulario.nombre}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="cantidadUnidades" className="mb-1 text-sm font-medium text-gray-700">Cantidad (unidades)</label>
          <input
            id="cantidadUnidades"
            type="number"
            name="cantidadUnidades"
            placeholder="Ej. 100"
            value={formulario.cantidadUnidades}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="precioUnidad" className="mb-1 text-sm font-medium text-gray-700">Precio por unidad (Q)</label>
          <input
            id="precioUnidad"
            type="number"
            name="precioUnidad"
            placeholder="Ej. 1.50"
            value={formulario.precioUnidad}
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
            <th className="p-2">Unidades</th>
            <th className="p-2">Precio (Q)</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dulces.map((dulce) => (
            <tr key={dulce.id} className="border-t">
              <td className="p-2">{dulce.nombre}</td>
              <td className="p-2">{dulce.cantidadUnidades}</td>
              <td className="p-2">Q{dulce.precioUnidad}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => manejarEditar(dulce)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminar(dulce.id)}
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
    </>
  );
}
