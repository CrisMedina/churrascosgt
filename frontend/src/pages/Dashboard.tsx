import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import Navbar from '../components/Navbar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // Datos simulados
  const ventasDiarias = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ventas diarias (Q)',
        data: [500, 750, 900, 600, 850, 1200, 1000],
        borderColor: '#f87171',
        backgroundColor: 'rgba(248,113,113,0.3)',
      },
    ],
  };

  const ventasMensuales = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Ventas mensuales (Q)',
        data: [3200, 4500, 3900, 5100, 4700, 5300, 6000],
        backgroundColor: '#60a5fa',
      },
    ],
  };

  const platosMasVendidos = {
    labels: ['Puyazo', 'Culotte', 'Costilla'],
    datasets: [
      {
        label: 'Platos más vendidos',
        data: [120, 90, 75],
        backgroundColor: ['#f87171', '#60a5fa', '#facc15'],
      },
    ],
  };

  const dulcesPopulares = {
    labels: ['Cocadas', 'Pepitoria', 'Colochos de guayaba'],
    datasets: [
      {
        data: [50, 40, 35],
        backgroundColor: ['#fbbf24', '#34d399', '#a78bfa'],
      },
    ],
  };

  const gananciasPorCategoria = {
    labels: ['Churrascos', 'Dulces'],
    datasets: [
      {
        data: [8500, 3000],
        backgroundColor: ['#f87171', '#60a5fa'],
      },
    ],
  };

  const desperdiciosYMermas = {
    labels: ['Frijoles', 'Chirmol', 'Cebollín', 'Costilla'],
    datasets: [
      {
        label: 'Cantidad desperdiciada',
        data: [3, 1, 2, 1],
        backgroundColor: '#f97316',
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Panel de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ventas Diarias */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-md font-semibold mb-2">Ventas Diarias</h2>
            <Line data={ventasDiarias} />
          </div>

          {/* Ventas Mensuales */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-md font-semibold mb-2">Ventas Mensuales</h2>
            <Bar data={ventasMensuales} />
          </div>

          {/* Platos más vendidos */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-md font-semibold mb-2">Platos más vendidos</h2>
            <Bar data={platosMasVendidos} />
          </div>

          {/* Dulces más populares */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-md font-semibold mb-2">Dulces más populares</h2>
            <div className="relative h-64">
              <Pie
                data={dulcesPopulares}
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                      align: 'center',
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Ganancias por categoría */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-md font-semibold mb-2">Ganancias por categoría</h2>
            <div className="relative h-64">
              <Doughnut
                data={gananciasPorCategoria}
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                      align: 'center',
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Desperdicios y mermas */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-md font-semibold mb-2">Desperdicios y mermas</h2>
            <Bar data={desperdiciosYMermas} />
          </div>
        </div>
      </div>
    </>
  );
}
