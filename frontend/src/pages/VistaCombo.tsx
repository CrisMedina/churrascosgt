import { useEffect, useState } from 'react';
import { usarCarrito } from '../context/CarritoContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const tiposDeCarne = ['Puyazo', 'Culotte', 'Costilla'];
const terminos = ['Término medio', 'Tres cuartos', 'Bien cocido'];
const guarnicionesDisponibles = ['Frijoles', 'Chile de árbol', 'Cebollín', 'Tortillas', 'Chirmol'];

const modalidades = [
  { tipo: 'individual', label: 'Plato individual (1 porción)', porciones: 1, precio: 75 },
  { tipo: 'familiar3', label: 'Familiar (3 porciones)', porciones: 3, precio: 210 },
  { tipo: 'familiar5', label: 'Familiar (5 porciones)', porciones: 5, precio: 330 }
];

export default function VistaCombo() {
  const { despachar } = usarCarrito();
  const [modalidad, setModalidad] = useState('');
  const [porciones, setPorciones] = useState<
    { carne: string; termino: string; guarniciones: string[] }[]
  >([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [mostrarSiguientePaso, setMostrarSiguientePaso] = useState(false);
  const [idEdicion, setIdEdicion] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('comboEditar');
    if (data) {
      try {
        const combo = JSON.parse(data);

        let tipoModalidad = '';
        if (combo.descripcion.includes('#5:')) tipoModalidad = 'familiar5';
        else if (combo.descripcion.includes('#3:')) tipoModalidad = 'familiar3';
        else tipoModalidad = 'individual';

        const porcionesDetectadas = combo.descripcion.split('|').filter(p => p.trim().startsWith('#')).map(p => {
          const matchCarne = p.match(/: (.*?) \(/);
          const matchTermino = p.match(/\((.*?)\)/);
          const matchGuarniciones = p.match(/con (.*)/);

          const guarniciones = matchGuarniciones?.[1]?.split(' y ').flatMap(str => str.split(',')).map(g => g.trim()) ?? [];

          return {
            carne: matchCarne?.[1] ?? '',
            termino: matchTermino?.[1] ?? '',
            guarniciones,
          };
        });

        const extrasDetectadas = combo.descripcion.includes('Extras:')
          ? combo.descripcion.split('Extras:')[1].split(',').map(e => e.trim())
          : [];

        setModalidad(tipoModalidad);
        setPorciones(porcionesDetectadas);
        setExtras(extrasDetectadas);
        setIdEdicion(combo.id);
      } catch (e) {
        console.error('Error al cargar combo para edición:', e);
      } finally {
        localStorage.removeItem('comboEditar');
      }
    }
  }, []);

  const handleSeleccionModalidad = (tipo: string) => {
    setModalidad(tipo);
    const m = modalidades.find(m => m.tipo === tipo);
    if (m) {
      setPorciones(
        Array.from({ length: m.porciones }, () => ({
          carne: '',
          termino: '',
          guarniciones: [] as string[],
        }))
      );
    }
  };

  const actualizarPorcion = (index: number, campo: 'carne' | 'termino', valor: string) => {
    setPorciones(prev => {
      const copia = [...prev];
      copia[index][campo] = valor;
      return copia;
    });
  };

  const toggleGuarnicion = (index: number, guarnicion: string) => {
    setPorciones(prev =>
      prev.map((p, i) => {
        if (i !== index) return { ...p };
        const yaSeleccionada = p.guarniciones.includes(guarnicion);
        let nuevasGuarniciones = [...p.guarniciones];

        if (yaSeleccionada) {
          nuevasGuarniciones = nuevasGuarniciones.filter(g => g !== guarnicion);
        } else if (nuevasGuarniciones.length < 2) {
          nuevasGuarniciones.push(guarnicion);
        }

        return { ...p, guarniciones: nuevasGuarniciones };
      })
    );
  };

  const toggleExtra = (guarnicion: string) => {
    setExtras(prev =>
      prev.includes(guarnicion)
        ? prev.filter(g => g !== guarnicion)
        : [...prev, guarnicion]
    );
  };

  const agregarAlCarrito = () => {
    const seleccion = modalidades.find(m => m.tipo === modalidad);
    if (!seleccion) {
      setError('Debe seleccionar una modalidad');
      return;
    }

    for (let i = 0; i < porciones.length; i++) {
      const p = porciones[i];
      if (!p.carne || !p.termino || p.guarniciones.length !== 2) {
        setError(`Porción #${i + 1} incompleta. Selecciona carne, término y 2 guarniciones.`);
        return;
      }
    }

    const precioExtras = extras.length * 5;
    const precioFinal = seleccion.precio + precioExtras;

    const descripcion = porciones
      .map(
        (p, i) =>
          `#${i + 1}: ${p.carne} (${p.termino}) con ${p.guarniciones.join(' y ')}`
      )
      .join(' | ') +
      (extras.length > 0 ? ` | Extras: ${extras.join(', ')}` : '');

    const productoCombo = {
      id: idEdicion || `combo-${Date.now()}`,
      nombre: 'Combo Churrasco Personalizado',
      descripcion,
      precio: precioFinal,
      cantidad: 1,
      tipo: 'combo' as const,
    };

    despachar({
      tipo: idEdicion ? 'ACTUALIZAR_PRODUCTO' : 'AGREGAR_PRODUCTO',
      payload: productoCombo,
    });

    toast.success(idEdicion ? '¡Combo actualizado!' : '¡Combo agregado al carrito!');

    setError('');
    setMostrarSiguientePaso(true);
    setModalidad('');
    setPorciones([]);
    setExtras([]);
    setIdEdicion(null);
  };

  const precioBase = modalidades.find(m => m.tipo === modalidad)?.precio ?? 0;
  const precioExtras = extras.length * 5;
  const precioTotal = precioBase + precioExtras;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-red-700">
          {idEdicion ? 'Editar Combo de Churrasco' : 'Armar Combo de Churrasco'}
        </h2>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {!mostrarSiguientePaso && (
          <>
            <div>
              <label className="font-semibold block mb-1">Modalidad:</label>
              <select
                value={modalidad}
                onChange={e => handleSeleccionModalidad(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Seleccione modalidad</option>
                {modalidades.map(m => (
                  <option key={m.tipo} value={m.tipo}>{m.label}</option>
                ))}
              </select>
            </div>

            {porciones.map((porcion, index) => (
              <div key={index} className="border rounded p-4 mt-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Porción #{index + 1}</h3>

                <div className="mb-2">
                  <label className="block text-sm font-medium">Tipo de carne:</label>
                  <select
                    value={porcion.carne}
                    onChange={e => actualizarPorcion(index, 'carne', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Seleccione carne</option>
                    {tiposDeCarne.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium">Término de cocción:</label>
                  <select
                    value={porcion.termino}
                    onChange={e => actualizarPorcion(index, 'termino', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Seleccione término</option>
                    {terminos.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Guarniciones (máximo 2):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {guarnicionesDisponibles.map(g => (
                      <label key={`${index}-${g}`} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={porcion.guarniciones.includes(g)}
                          disabled={
                            porcion.guarniciones.length >= 2 &&
                            !porcion.guarniciones.includes(g)
                          }
                          onChange={() => toggleGuarnicion(index, g)}
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Seleccionadas: {porcion.guarniciones.length} / 2
                  </p>
                </div>
              </div>
            ))}

            {porciones.length > 0 && (
              <div className="mt-6">
                <label className="font-semibold block mb-2">Guarniciones extra (Q5 c/u):</label>
                <div className="grid grid-cols-2 gap-2">
                  {guarnicionesDisponibles.map(g => (
                    <label key={`extra-${g}`} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={extras.includes(g)}
                        onChange={() => toggleExtra(g)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {modalidad && (
              <div className="mt-6 border-t pt-4">
                <p className="text-lg font-semibold text-gray-800">
                  Precio base: Q{precioBase.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Extras seleccionadas: {extras.length} x Q5 = Q{precioExtras.toFixed(2)}
                </p>
                <p className="text-xl font-bold text-green-700 mt-2">
                  Total: Q{precioTotal.toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={agregarAlCarrito}
              className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {idEdicion ? 'Guardar cambios' : 'Agregar al carrito'}
            </button>
          </>
        )}

        {mostrarSiguientePaso && (
          <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded shadow">
            <p className="text-green-700 font-medium mb-4">
              {idEdicion ? 'Combo actualizado con éxito' : 'Combo agregado al carrito'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setMostrarSiguientePaso(false)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {idEdicion ? 'Editar nuevamente' : 'Armar otro combo'}
              </button>
              <Link
                to="/carrito"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
              >
                Ir al carrito
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
