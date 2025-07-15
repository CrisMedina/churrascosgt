import { usarCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';
import { registrarVenta, obtenerRecomendacionCombo } from '../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
  const { estado, despachar } = usarCarrito();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [mensajesIA, setMensajesIA] = useState<string[]>([]);
  const [cargandoIA, setCargandoIA] = useState(false);

  const total = estado.productos.reduce(
    (acum, prod) => acum + prod.precio * prod.cantidad,
    0
  );

  const quitarProducto = (id: string) => {
    despachar({ tipo: 'QUITAR_PRODUCTO', payload: id });
  };

  const confirmarVenta = async () => {
    if (!token) return alert('Token no disponible. Inicia sesión.');

    try {
      await registrarVenta(estado.productos, token);
      alert('Venta realizada con éxito');
      despachar({ tipo: 'VACIAR_CARRITO' });
    } catch (error) {
      alert('Error al registrar la venta');
      console.error(error);
    }
  };

  const pedirSugerenciaIA = async () => {
    const resumen = estado.productos.map((p) => `${p.nombre} x${p.cantidad}`);

    setCargandoIA(true);
    setMensajesIA((prev) => [...prev, 'Escribiendo...']);

    try {
      const respuesta = await obtenerRecomendacionCombo(resumen);
      let texto = '';

      if (typeof respuesta === 'object' && respuesta.choices) {
        texto = respuesta.choices?.[0]?.message?.content || 'No hubo respuesta del modelo.';
      } else if (typeof respuesta === 'string') {
        try {
          const parsed = JSON.parse(respuesta);
          texto = parsed.choices?.[0]?.message?.content || 'No hubo respuesta del modelo.';
        } catch {
          texto = respuesta;
        }
      }

      setMensajesIA((prev) => [...prev.slice(0, -1), texto]);
    } catch (error) {
      console.error('Error al consultar recomendación:', error);
      setMensajesIA((prev) => [...prev.slice(0, -1), 'Ocurrió un error al consultar la IA.']);
    } finally {
      setCargandoIA(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Carrito de compras</h2>

      {estado.productos.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="space-y-4">
          {estado.productos.map((producto) => (
            <div
              key={producto.id}
              className="flex justify-between items-center border p-4 rounded-lg bg-white shadow"
            >
              <div>
                <h3 className="font-semibold">{producto.nombre}</h3>
                <p className="text-sm text-gray-500">
                  Cantidad: {producto.cantidad}
                  {producto.tipo === 'dulce' && producto.nombre.includes('(') && (
                    <> | Presentación: {producto.nombre.split('(')[1].replace(')', '')}</>
                  )} | Q{producto.precio.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                {producto.tipo === 'combo' && (
                  <button
                    onClick={() => {
                      localStorage.setItem('comboEditar', JSON.stringify(producto));
                      navigate('/combo');
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                )}

                {producto.tipo === 'dulce' && (
                  <button
                    onClick={() => {
                      const dulce = {
                        id: producto.id,
                        nombre: producto.nombre.split(' (')[0]
                      };
                      localStorage.setItem('dulceEditar', JSON.stringify(dulce));
                      navigate('/dulces');
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                )}

                <button
                  onClick={() => quitarProducto(producto.id)}
                  className="text-red-500 hover:underline"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <p className="text-lg font-bold">Total: Q{total.toFixed(2)}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={confirmarVenta}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              Confirmar venta
            </button>

            <button
              onClick={pedirSugerenciaIA}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
              disabled={cargandoIA}
            >
              {cargandoIA ? 'Consultando IA...' : '¿Qué combo recomienda la IA?'}
            </button>
          </div>

          {mensajesIA.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-2">Chat con la IA:</h4>
              <div className="space-y-2">
                {mensajesIA.map((msg, idx) => (
                  <p
                    key={idx}
                    className={`px-3 py-2 rounded-lg ${
                      msg === 'Escribiendo...'
                        ? 'bg-gray-300 text-gray-700 italic'
                        : 'bg-purple-100 text-gray-800'
                    }`}
                  >
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
