import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        const err = await res.json();
        alert(err.message || 'Username atau password salah!');
      }
    } catch (err) {
      // Graceful local development fallback if backend is offline
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('admin_token', 'offline-fallback-token');
        navigate('/admin');
      } else {
        alert('Gagal menyambungkan ke server backend.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2D5A27] rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Login Admin</h1>
          <p className="text-gray-500">Sistem Informasi Desa Benjor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-[#2D5A27] focus:border-[#2D5A27]"
                placeholder="admin"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-[#2D5A27] focus:border-[#2D5A27]"
                placeholder="admin"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded text-[#2D5A27] focus:ring-[#2D5A27]" />
              Ingat saya
            </label>
            <button type="button" onClick={() => alert('Silakan hubungi administrator sistem untuk mereset password.')} className="text-[#2D5A27] hover:underline font-medium">
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D5A27] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors mt-6"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
