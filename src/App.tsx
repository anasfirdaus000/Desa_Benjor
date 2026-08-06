import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Login from './pages/Login';

import Home from './pages/public/Home';
import Profil from './pages/public/Profil';
import Umkm from './pages/public/Umkm';
import UmkmDetail from './pages/public/UmkmDetail';
import Infografis from './pages/public/Infografis';
import Berita from './pages/public/Berita';
import BeritaDetail from './pages/public/BeritaDetail';
import Galeri from './pages/public/Galeri';

import AdminDashboard from './pages/admin/Dashboard';
import AdminMedia from './pages/admin/KelolaMedia';
import AdminSotk from './pages/admin/KelolaSOTK';
import AdminUmkm from './pages/admin/KelolaUMKM';
import AdminBerita from './pages/admin/KelolaBerita';
import AdminInfografis from './pages/admin/KelolaInfografis';
import AdminPengaturan from './pages/admin/KelolaPengaturan';
import AdminAkun from './pages/admin/KelolaAkun';
import AdminSambutan from './pages/admin/KelolaSambutan';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="profil" element={<Profil />} />
            <Route path="umkm" element={<Umkm />} />
            <Route path="umkm/:id" element={<UmkmDetail />} />
            <Route path="infografis" element={<Infografis />} />
            <Route path="berita" element={<Berita />} />
            <Route path="berita/:id" element={<BeritaDetail />} />
            <Route path="galeri" element={<Galeri />} />
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="sotk" element={<AdminSotk />} />
            <Route path="umkm" element={<AdminUmkm />} />
            <Route path="berita" element={<AdminBerita />} />
            <Route path="infografis" element={<AdminInfografis />} />
            <Route path="pengaturan" element={<AdminPengaturan />} />
            <Route path="akun" element={<AdminAkun />} />
            <Route path="sambutan" element={<AdminSambutan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
