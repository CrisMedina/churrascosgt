import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usarCarrito } from "../context/CarritoContext";
import { ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Navbar() {
  const { rol, cerrarSesion } = useAuth();
  const { estado } = usarCarrito();
  const cantidad = estado.productos.length;
  const [mostrarSubmenu, setMostrarSubmenu] = useState(false);
  const location = useLocation();

  const toggleSubmenu = () => setMostrarSubmenu(!mostrarSubmenu);

  const esActivo = (ruta: string) => location.pathname.startsWith(ruta);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
        <Link
          to={rol === "admin" ? "/dashboard" : "/catalogo"}
          className="mb-2 sm:mb-0 flex items-center"
        >
          <img
            src="/logo.png"
            alt="ChurrascosGT"
            className="h-10 sm:h-12 object-contain"
          />
        </Link>

        <nav className="flex flex-wrap gap-4 justify-center text-base font-medium items-center relative">
          {rol === "admin" && (
            <>
              <Link
                to="/usuarios/nuevo"
                className={clsx(
                  "hover:text-red-600 transition",
                  esActivo("/usuarios") ? "text-red-600 font-semibold border-b-2 border-red-600" : "text-gray-700"
                )}
              >
                Usuarios
              </Link>

              {/* Inventario con submenú */}
              <div className="relative">
                <button
                  onClick={toggleSubmenu}
                  className={clsx(
                    "flex items-center transition",
                    esActivo("/inventario")
                      ? "text-red-600 font-semibold border-b-2 border-red-600"
                      : "text-gray-700 hover:text-red-600"
                  )}
                >
                  Inventario
                  <ChevronDown
                    className={clsx(
                      "w-4 h-4 ml-1 transition-transform duration-200",
                      mostrarSubmenu ? "rotate-180" : ""
                    )}
                  />
                </button>

                {mostrarSubmenu && (
                  <div className="absolute z-50 bg-white border shadow-md rounded-md mt-2 py-2 w-56 right-0">
                    {[
                      { ruta: "/inventario/carnes", texto: "Carnes por libra" },
                      { ruta: "/inventario/guarniciones", texto: "Ingredientes para guarniciones" },
                      { ruta: "/inventario/dulces", texto: "Dulces por unidad" },
                      { ruta: "/inventario/empaques", texto: "Cajas y empaques" },
                      { ruta: "/inventario/combustible", texto: "Carbón y leña" },
                    ].map(({ ruta, texto }) => (
                      <Link
                        key={ruta}
                        to={ruta}
                        className={clsx(
                          "block px-4 py-2 text-sm hover:bg-gray-100 transition",
                          esActivo(ruta) ? "text-red-600 font-semibold bg-gray-50" : "text-gray-700"
                        )}
                        onClick={() => setMostrarSubmenu(false)}
                      >
                        {texto}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/catalogo"
                className={clsx(
                  "hover:text-red-600 transition",
                  esActivo("/catalogo") ? "text-red-600 font-semibold border-b-2 border-red-600" : "text-gray-700"
                )}
              >
                Ventas
              </Link>
            </>
          )}

          {(rol === "cliente" || rol === "admin") && (
            <Link to="/carrito" className="relative text-gray-700 hover:text-red-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {cantidad > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cantidad}
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* Botón cerrar sesión */}
        <button
          onClick={cerrarSesion}
          className="text-gray-700 hover:text-red-600 transition"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
