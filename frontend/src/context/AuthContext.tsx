import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from "react-router-dom";

type UsuarioToken = {
  name: string; 
  role: string; 
  exp: number;
};

type AuthContextType = {
  usuario: string | null;
  rol: string | null;
  token: string | null;
  iniciarSesion: (token: string) => void;
  cerrarSesion: () => void;
  estaAutenticado: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UsuarioToken>(token);
        setUsuario(decoded.name);
        setRol(decoded.role);
      } catch {
        cerrarSesion();
      }
    }
  }, [token]);

  const iniciarSesion = (nuevoToken: string) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);

    const decoded = jwtDecode<UsuarioToken>(nuevoToken);
    setUsuario(decoded.name);
    setRol(decoded.role);

    if (decoded.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/catalogo");
    }
  };


  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
    setRol(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        token,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
