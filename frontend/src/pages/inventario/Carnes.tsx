import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import {
  obtenerCarnes,
  crearCarne,
  actualizarCarne,
  eliminarCarne,
} from "../../services/api"; 

type Carne = {
  id: number;
  nombre: string;
  tipo: string;
  cantidadLibras: number;
  precioPorLibra: number;
};

export default function Carnes() {
  const [carnes, setCarnes] = useState<Carne[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    tipo: "",
    cantidadLibras: "",
    precioPorLibra: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarCarnes = async () => {
    try {
      const res = await obtenerCarnes();
      setCarnes(res.data);
    } catch (err) {
      console.error("Error al obtener carnes:", err);
    }
  };

  useEffect(() => {
    cargarCarnes();
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const datos = {
      nombre: formulario.nombre,
      tipo: formulario.tipo,
      cantidadLibras: Number(formulario.cantidadLibras),
      precioPorLibra: Number(formulario.precioPorLibra),
    };

    try {
      if (editandoId !== null) {
        await actualizarCarne(editandoId, datos);
      } else {
        await crearCarne(datos);
      }
      await cargarCarnes();
      setFormulario({
        nombre: "",
        tipo: "",
        cantidadLibras: "",
        precioPorLibra: "",
      });
      setEditandoId(null);
    } catch (err) {
      console.error("Error al guardar carne:", err);
    }
  };

  const manejarEditar = (carne: Carne) => {
    setFormulario({
      nombre: carne.nombre,
      tipo: carne.tipo,
      cantidadLibras: carne.cantidadLibras.toString(),
      precioPorLibra: carne.precioPorLibra.toString(),
    });
    setEditandoId(carne.id);
  };

  const manejarEliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta carne?")) {
      try {
        await eliminarCarne(id);
        await cargarCarnes();
      } catch (err) {
        console.error("Error al eliminar carne:", err);
      }
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Carnes por libra</h1>

      <form onSubmit={manejarSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="nombre" className="mb-1 text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Ej. Costilla de res"
            value={formulario.nombre}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tipo" className="mb-1 text-sm font-medium text-gray-700">Tipo de carne</label>
          <input
            id="tipo"
            type="text"
            name="tipo"
            placeholder="Roja o Blanca"
            value={formulario.tipo}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="cantidadLibras" className="mb-1 text-sm font-medium text-gray-700">Cantidad (libras)</label>
          <input
            id="cantidadLibras"
            type="number"
            name="cantidadLibras"
            placeholder="Ej. 25"
            value={formulario.cantidadLibras}
            onChange={manejarCambio}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="precioPorLibra" className="mb-1 text-sm font-medium text-gray-700">Precio por libra (Q)</label>
          <input
            id="precioPorLibra"
            type="number"
            name="precioPorLibra"
            placeholder="Ej. 20.50"
            value={formulario.precioPorLibra}
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
            <th className="p-2">Tipo</th>
            <th className="p-2">Libras</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carnes.map((carne) => (
            <tr key={carne.id} className="border-t">
              <td className="p-2">{carne.nombre}</td>
              <td className="p-2">{carne.tipo}</td>
              <td className="p-2">{carne.cantidadLibras}</td>
              <td className="p-2">Q{carne.precioPorLibra}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => manejarEditar(carne)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminar(carne.id)}
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
