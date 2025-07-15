import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authService";

export default function Registro() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registrarUsuario(nombreUsuario, contraseña);
      alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      navigate("/"); // Redirige a login
    } catch (error) {
      alert("Error al registrar usuario. Intenta con otro nombre.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/churrasco.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-red-800">
          Registro de usuario
        </h1>

        <form onSubmit={manejarRegistro} className="space-y-4">
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
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
