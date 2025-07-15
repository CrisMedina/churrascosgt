import { api } from "./api";

export const iniciarSesion = async (nombreUsuario: string, contraseña: string) => {
  const response = await api.post("/api/iniciar-sesion", {
    nombreUsuario,
    contraseña,
  });
  return response.data; 
};

export async function registrarUsuario(usuario: string, contraseña: string) {
  const response = await api.post('/api/registrar', {
    nombreUsuario: usuario,
    contraseña: contraseña,
    rol: 'cliente', 
  });

  return response.data;
}
