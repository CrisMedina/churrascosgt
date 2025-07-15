import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5015",
});

export const obtenerProductos = async (token: string) => {
  const respuesta = await api.get('/productos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return respuesta.data;
};

export const registrarVenta = async (productos: any[], token: string) => {
  const respuesta = await api.post(
    '/ventas',
    { productos },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return respuesta.data;
};

export const obtenerRecomendacionCombo = async (productos: string[]) => {
  const respuesta = await api.post('/ventas/recomendar-combo', productos);
  return respuesta.data;
};


export const obtenerDulces = () => api.get("/dulces");
export const crearDulce = (data: any) => api.post("/dulces", data);
export const actualizarDulce = (id: number, data: any) => api.put(`/dulces/${id}`, data);
export const eliminarDulce = (id: number) => api.delete(`/dulces/${id}`);

export const obtenerCarnes = () => api.get("/carnes");
export const crearCarne = (data: any) => api.post("/carnes", data);
export const actualizarCarne = (id: number, data: any) => api.put(`/carnes/${id}`, data);
export const eliminarCarne = (id: number) => api.delete(`/carnes/${id}`);

