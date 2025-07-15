
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { usarCarrito } from '../context/CarritoContext';
import toast from 'react-hot-toast';

const tiposDeCarne = ['Puyazo', 'Culotte', 'Costilla'];
const terminos = ['Término medio', 'Tres cuartos', 'Bien cocido'];
const guarnicionesDisponibles = ['Frijoles', 'Chile de árbol', 'Cebollín', 'Tortillas', 'Chirmol'];

const combos = [
  {
    id: 'combo-familiar',
    nombre: 'Combo Familiar',
    platos: 1,
    cajasDulces: 1,
    descripcion: '1 plato familiar + 1 caja de dulces típicos (24 unidades)',
    precioBase: 150,
  },
  {
    id: 'combo-eventos',
    nombre: 'Combo para Eventos',
    platos: 3,
    cajasDulces: 2,
    descripcion: '3 platos familiares + 2 cajas grandes de dulces típicos',
    precioBase: 450,
  },
  {
    id: 'combo-temporada',
    nombre: 'Combo de Temporada',
    platos: 2,
    cajasDulces: 1,
    descripcion: 'Paquete especial ajustable según temporada',
    precioBase: 230,
  },
];

export default function VistaCombosEspeciales() {
  const { despachar } = usarCarrito();
  const [comboActivo, setComboActivo] = useState<string | null>(null);
  const [selecciones, setSelecciones] = useState<Record<string, any>>({});

  const inicializarCombo = (comboId: string, platos: number) => {
    const porciones = Array.from({ length: platos * 5 }).map(() => ({
      carne: '',
      termino: '',
      guarniciones: [],
    }));
    setSelecciones({ [comboId]: porciones });
    setComboActivo(comboId);
  };

  const actualizarPorcion = (comboId: string, index: number, campo: 'carne' | 'termino', valor: string) => {
    setSelecciones(prev => {
      const copia = [...(prev[comboId] || [])];
      copia[index][campo] = valor;
      return { ...prev, [comboId]: copia };
    });
  };

  const toggleGuarnicion = (comboId: string, index: number, guarnicion: string) => {
    setSelecciones(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([key, value]) => {
          if (key !== comboId) return [key, value];
          const nuevaPorciones = [...value];
          const porcion = { ...nuevaPorciones[index] };
          const yaSeleccionada = porcion.guarniciones?.includes(guarnicion);

          if (!porcion.guarniciones) porcion.guarniciones = [];

          if (yaSeleccionada) {
            porcion.guarniciones = porcion.guarniciones.filter((g: string) => g !== guarnicion);
          } else if (porcion.guarniciones.length < 2) {
            porcion.guarniciones.push(guarnicion);
          }

          nuevaPorciones[index] = porcion;
          return [key, nuevaPorciones];
        })
      )
    );
  };

  const agregarAlCarrito = (combo: any) => {
    const platos = selecciones[combo.id];
    if (!platos || platos.length === 0) {
      toast.error('Completa la configuración del combo');
      return;
    }

    const descripcion = platos
      .map((p: any, i: number) => {
        return `#${i + 1}: ${p.carne} (${p.termino}) con ${p.guarniciones?.join(' y ')}`;
      })
      .join(' | ');

    const producto = {
      id: combo.id + '-' + Date.now(),
      nombre: combo.nombre,
      descripcion,
      cantidad: 1,
      precio: combo.precioBase,
      tipo: 'combo' as const,
    };

    despachar({ tipo: 'AGREGAR_PRODUCTO', payload: producto });
    toast.success('Combo agregado al carrito');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-red-700 mb-6">Combos Especiales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {combos.map((combo) => (
            <div key={combo.id} className="border rounded-lg p-4 bg-white shadow">
              <h3 className="text-xl font-semibold text-red-800">{combo.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{combo.descripcion}</p>
              <p className="text-sm text-gray-800 mb-4 font-bold">Q{combo.precioBase.toFixed(2)}</p>

              {comboActivo !== combo.id ? (
                <button
                  onClick={() => inicializarCombo(combo.id, combo.platos)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Personalizar platos
                </button>
              ) : (
                <>
                  {selecciones[combo.id]?.map((porcion: any, index: number) => (
                    <div key={index} className="mb-4 border p-3 rounded bg-gray-50">
                      <p className="font-semibold mb-1">Porción #{index + 1}</p>

                      <select
                        value={porcion.carne}
                        onChange={(e) =>
                          actualizarPorcion(combo.id, index, 'carne', e.target.value)
                        }
                        className="w-full mb-2 border px-3 py-1 rounded"
                      >
                        <option value="">Tipo de carne</option>
                        {tiposDeCarne.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <select
                        value={porcion.termino}
                        onChange={(e) =>
                          actualizarPorcion(combo.id, index, 'termino', e.target.value)
                        }
                        className="w-full mb-2 border px-3 py-1 rounded"
                      >
                        <option value="">Término de cocción</option>
                        {terminos.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      <div className="mb-1 text-sm text-gray-700">Guarniciones (máximo 2):</div>
                      <div className="grid grid-cols-2 gap-2">
                        {guarnicionesDisponibles.map((g) => (
                          <label key={g} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={porcion.guarniciones?.includes(g) ?? false}
                              disabled={
                                (porcion.guarniciones?.length ?? 0) >= 2 &&
                                !porcion.guarniciones?.includes(g)
                              }
                              onChange={() => toggleGuarnicion(combo.id, index, g)}
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => agregarAlCarrito(combo)}
                    className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700"
                  >
                    Agregar al carrito
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
