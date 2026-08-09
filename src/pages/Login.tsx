import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert, X } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Reset password states
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const getApiBase = () => {
    return import.meta.env.PROD ? '' : 'http://localhost:5000';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_BASE = getApiBase();
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

  // Open reset password modal and load security question
  const handleOpenReset = async () => {
    setResetError('');
    setResetSuccess('');
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmPassword('');
    
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/api/auth/security-question`);
      if (res.ok) {
        const data = await res.json();
        setSecurityQuestion(data.question);
        setIsResetOpen(true);
      } else {
        alert('Gagal memuat pertanyaan keamanan dari server.');
      }
    } catch (err) {
      alert('Gagal menyambungkan ke server.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword !== confirmPassword) {
      setResetError('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('Password baru minimal 6 karakter!');
      return;
    }

    setIsResetLoading(true);
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: securityAnswer,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResetSuccess('Password berhasil diperbarui! Silakan login kembali.');
        setTimeout(() => {
          setIsResetOpen(false);
        }, 2000);
      } else {
        setResetError(data.message || 'Gagal mereset password.');
      }
    } catch (err) {
      setResetError('Gagal menyambungkan ke server.');
    } finally {
      setIsResetLoading(false);
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
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-[#2D5A27] focus:border-[#2D5A27] bg-white text-gray-800"
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
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-[#2D5A27] focus:border-[#2D5A27] bg-white text-gray-800"
                placeholder="Password"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded text-[#2D5A27] focus:ring-[#2D5A27]" />
              Ingat saya
            </label>
            <button 
              type="button" 
              onClick={handleOpenReset} 
              className="text-[#2D5A27] hover:underline font-medium cursor-pointer"
            >
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D5A27] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors mt-6 cursor-pointer"
          >
            Masuk
          </button>
        </form>
      </div>

      {/* Lupa Password Modal Overlay */}
      {isResetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2 text-[#2D5A27]">
                <ShieldAlert size={20} />
                <h3 className="text-base font-bold text-gray-800">Reset Password Admin</h3>
              </div>
              <button 
                onClick={() => setIsResetOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide">Pertanyaan Keamanan:</span>
                <p className="text-sm font-semibold text-amber-950 mt-1">{securityQuestion}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jawaban Keamanan</label>
                <input 
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                  placeholder="Ketik jawaban keamanan Anda..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password Baru</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                  placeholder="Ketik password baru Anda..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                  placeholder="Ulangi password baru Anda..."
                  required
                />
              </div>

              {resetError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{resetError}</p>
              )}
              {resetSuccess && (
                <p className="text-xs text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-200 text-center font-bold">{resetSuccess}</p>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2 border text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isResetLoading}
                  className="bg-[#2D5A27] hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  {isResetLoading ? 'Mereset...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
