import { createContext, useReducer, useContext, ReactNode } from 'react';

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: 'churrasco' | 'dulce' | 'combo';
};

type EstadoCarrito = {
  productos: Producto[];
};

type AccionCarrito =
  | { tipo: 'AGREGAR_PRODUCTO'; payload: Producto }
  | { tipo: 'QUITAR_PRODUCTO'; payload: string }
  | { tipo: 'VACIAR_CARRITO' }
  | { tipo: 'ACTUALIZAR_PRODUCTO'; payload: Producto };

const CarritoContext = createContext<{
  estado: EstadoCarrito;
  despachar: React.Dispatch<AccionCarrito>;
} | null>(null);

const estadoInicial: EstadoCarrito = {
  productos: [],
};

function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  switch (accion.tipo) {
    case 'AGREGAR_PRODUCTO':
      const existente = estado.productos.find(p => p.id === accion.payload.id);
      if (existente) {
        return {
          ...estado,
          productos: estado.productos.map(p =>
            p.id === accion.payload.id
              ? { ...p, cantidad: p.cantidad + accion.payload.cantidad }
              : p
          ),
        };
      } else {
        return {
          ...estado,
          productos: [...estado.productos, accion.payload],
        };
      }
    case 'QUITAR_PRODUCTO':
      return {
        ...estado,
        productos: estado.productos.filter(p => p.id !== accion.payload),
      };
    case 'VACIAR_CARRITO':
      return { ...estado, productos: [] };
    case 'ACTUALIZAR_PRODUCTO':
      return {
        ...estado,
        productos: estado.productos.map(p =>
          p.id === accion.payload.id ? accion.payload : p
        ),
      };
    default:
      return estado;
  }
}

export const ProveedorCarrito = ({ children }: { children: ReactNode }) => {
  const [estado, despachar] = useReducer(carritoReducer, estadoInicial);
  return (
    <CarritoContext.Provider value={{ estado, despachar }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const usarCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error('usarCarrito debe usarse dentro de ProveedorCarrito');
  return contexto;
};
