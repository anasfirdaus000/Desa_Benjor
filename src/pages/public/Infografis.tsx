import React from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Infografis = () => {
  const { infografis } = useAppContext();

  const pendudukData = {
    labels: infografis.penduduk.labels,
    datasets: [
      {
        data: infografis.penduduk.data,
        backgroundColor: ['#3b82f6', '#ec4899'], // blue and pink
        borderWidth: 0,
      },
    ],
  };

  const apbdesData = {
    labels: infografis.apbdes.labels,
    datasets: [
      {
        label: 'Juta Rupiah',
        data: infografis.apbdes.data,
        backgroundColor: '#2D5A27',
        borderRadius: 4,
      },
    ],
  };

  const bansosData = {
    labels: infografis.bansos.labels,
    datasets: [
      {
        data: infografis.bansos.data,
        backgroundColor: ['#f59e0b', '#10b981', '#6366f1'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparansi & Data Desa</h1>
          <p className="text-lg text-gray-600">Visualisasi data kependudukan, keuangan desa, dan bantuan sosial Desa Benjor.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demografi Penduduk */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center border-b pb-4">Demografi Penduduk</h2>
            <div className="h-64 relative">
              <Pie data={pendudukData} options={chartOptions} />
            </div>
            <div className="mt-6 flex justify-around text-center border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Laki-laki</p>
                <p className="text-2xl font-bold text-blue-500">{infografis.penduduk.data[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Perempuan</p>
                <p className="text-2xl font-bold text-pink-500">{infografis.penduduk.data[1]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-800">{infografis.penduduk.data.reduce((a,b)=>a+b,0)}</p>
              </div>
            </div>
          </div>

          {/* Bansos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center border-b pb-4">Penerima Bantuan Sosial</h2>
            <div className="h-64 relative">
              <Doughnut data={bansosData} options={chartOptions} />
            </div>
            <div className="mt-6 text-center border-t pt-4">
               <p className="text-sm text-gray-500">Total Penerima Manfaat</p>
               <p className="text-3xl font-bold text-[#2D5A27]">{infografis.bansos.data.reduce((a,b)=>a+b,0)} KK</p>
            </div>
          </div>

          {/* APBDes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center border-b pb-4">Transparansi APBDes (Anggaran Desa)</h2>
            <div className="h-80 relative">
              <Bar 
                data={apbdesData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Juta Rupiah' }
                    }
                  }
                }} 
              />
            </div>
            <div className="mt-6 text-center text-sm text-gray-500 italic">
              *Data disajikan dalam satuan Juta Rupiah
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Infografis;
