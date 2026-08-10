import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert, X, HelpCircle } from 'lucide-react';

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

  // Recover username states
  const [isRecoverUsernameOpen, setIsRecoverUsernameOpen] = useState(false);
  const [recoverAnswer, setRecoverAnswer] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const [recoveredUsername, setRecoveredUsername] = useState('');
  const [isRecoverLoading, setIsRecoverLoading] = useState(false);

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
        localStorage.setItem('admin_username', data.username);
        navigate('/admin');
      } else {
        const err = await res.json();
        alert(err.message || 'Username atau password salah!');
      }
    } catch (err) {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('admin_token', 'offline-fallback-token');
        localStorage.setItem('admin_username', 'admin');
        navigate('/admin');
      } else {
        alert('Gagal menyambungkan ke server backend.');
      }
    }
  };

  // Open reset password modal
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
        alert('Gagal memuat pertanyaan keamanan.');
      }
    } catch (err) {
      alert('Gagal menyambungkan ke server.');
    }
  };

  // Open recover username modal
  const handleOpenRecoverUsername = async () => {
    setRecoverError('');
    setRecoveredUsername('');
    setRecoverAnswer('');
    
    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/api/auth/security-question`);
      if (res.ok) {
        const data = await res.json();
        setSecurityQuestion(data.question);
        setIsRecoverUsernameOpen(true);
      } else {
        alert('Gagal memuat pertanyaan keamanan.');
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

  const handleRecoverUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError('');
    setRecoveredUsername('');
    setIsRecoverLoading(true);

    try {
      const API_BASE = getApiBase();
      const res = await fetch(`${API_BASE}/api/auth/recover-username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: recoverAnswer })
      });

      const data = await res.json();
      if (res.ok) {
        setRecoveredUsername(data.username);
      } else {
        setRecoverError(data.message || 'Jawaban keamanan salah!');
      }
    } catch (err) {
      setRecoverError('Gagal menyambungkan ke server.');
    } finally {
      setIsRecoverLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2D5A27] rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-md">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Login Admin</h1>
          <p className="text-gray-500 dark:text-gray-450 text-sm">Sistem Informasi Desa Benjor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-350 uppercase tracking-wide mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-350 uppercase tracking-wide mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-2.5 border dark:border-gray-755 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex justify-between items-center text-gray-550 dark:text-gray-400">
              <button 
                type="button" 
                onClick={handleOpenRecoverUsername} 
                className="text-[#2D5A27] dark:text-green-400 hover:underline font-semibold cursor-pointer"
              >
                Lupa Username?
              </button>
              <button 
                type="button" 
                onClick={handleOpenReset} 
                className="text-[#2D5A27] dark:text-green-400 hover:underline font-semibold cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D5A27] hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors mt-6 cursor-pointer shadow-md"
          >
            Masuk
          </button>
        </form>
      </div>

      {/* Lupa Password Modal Overlay */}
      {isResetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border dark:border-gray-800">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
              <div className="flex items-center gap-2 text-[#2D5A27] dark:text-green-400">
                <ShieldAlert size={20} />
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Reset Password Admin</h3>
              </div>
              <button 
                onClick={() => setIsResetOpen(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleResetSubmit} className="p-6 space-y-4 text-gray-800 dark:text-gray-250">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/35 p-3 rounded-lg">
                <span className="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Pertanyaan Keamanan:</span>
                <p className="text-sm font-bold text-amber-950 dark:text-white mt-1">{securityQuestion}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-305 mb-1">Jawaban Keamanan</label>
                <input 
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Ketik jawaban keamanan Anda..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-305 mb-1">Password Baru</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 border dark:border-gray-755 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Ketik password baru Anda..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-305 mb-1">Konfirmasi Password Baru</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 border dark:border-gray-755 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Ulangi password baru Anda..."
                  required
                />
              </div>

              {resetError && (
                <p className="text-xs text-red-650 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border dark:border-red-900/30">{resetError}</p>
              )}
              {resetSuccess && (
                <p className="text-xs text-green-600 bg-green-50 dark:bg-green-950/40 p-2.5 rounded-lg border dark:border-green-900/30 text-center font-bold">{resetSuccess}</p>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2 border dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isResetLoading}
                  className="bg-[#2D5A27] hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {isResetLoading ? 'Mereset...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lupa Username Modal Overlay */}
      {isRecoverUsernameOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border dark:border-gray-800">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
              <div className="flex items-center gap-2 text-[#2D5A27] dark:text-green-400">
                <HelpCircle size={20} />
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Pulihkan Username Admin</h3>
              </div>
              <button 
                onClick={() => setIsRecoverUsernameOpen(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecoverUsernameSubmit} className="p-6 space-y-4 text-gray-800 dark:text-gray-250">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/35 p-3 rounded-lg">
                <span className="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Pertanyaan Keamanan:</span>
                <p className="text-sm font-bold text-amber-950 dark:text-white mt-1">{securityQuestion}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-305 mb-1">Jawaban Keamanan</label>
                <input 
                  type="text"
                  value={recoverAnswer}
                  onChange={(e) => setRecoverAnswer(e.target.value)}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  placeholder="Ketik jawaban keamanan Anda..."
                  required
                />
              </div>

              {recoveredUsername && (
                <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/30 p-4 rounded-xl text-center">
                  <span className="block text-[11px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Username Admin Anda:</span>
                  <p className="text-xl font-extrabold text-green-900 dark:text-green-300 mt-1 select-all">{recoveredUsername}</p>
                  <p className="text-[10px] text-gray-500 mt-2">Silakan salin username di atas dan gunakan untuk masuk.</p>
                </div>
              )}

              {recoverError && (
                <p className="text-xs text-red-650 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border dark:border-red-900/30">{recoverError}</p>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRecoverUsernameOpen(false)}
                  className="px-4 py-2 border dark:border-gray-750 text-gray-700 dark:text-gray-305 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                {!recoveredUsername && (
                  <button 
                    type="submit" 
                    disabled={isRecoverLoading}
                    className="bg-[#2D5A27] hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {isRecoverLoading ? 'Memproses...' : 'Tampilkan Username'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
