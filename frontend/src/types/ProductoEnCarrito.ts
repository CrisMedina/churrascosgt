export type ProductoEnCarrito = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: 'churrasco' | 'dulce' | 'combo';
};
