import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { iniciarSesion as iniciarSesionAPI } from "../services/authService";

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await iniciarSesionAPI(nombreUsuario, contraseña);
      iniciarSesion(token);
    } catch (error) {
      alert("Credenciales inválidas");
    }
  };

  const irARegistro = () => {
    navigate("/registro");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/churrasco.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ChurrascosGT" className="h-14 sm:h-16 object-contain" />
        </div>

        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">¿No tienes una cuenta?</p>
          <button
            onClick={irARegistro}
            className="mt-1 text-red-700 font-semibold hover:underline"
          >
            Registrar usuario
          </button>
        </div>
      </div>
    </div>
  );
}
