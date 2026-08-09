import React, { useState, useEffect } from 'react';
import { Save, Lock, ShieldQuestion } from 'lucide-react';

const KelolaAkun = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing security question
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/auth/security-question`);
        if (res.ok) {
          const data = await res.json();
          setSecurityQuestion(data.question);
        }
      } catch (err) {
        console.warn('Could not load security question:', err);
      }
    };
    loadQuestion();
  }, []);

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('Password baru dan konfirmasi tidak cocok');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('Password baru minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword: newPassword || undefined,
          securityQuestion: securityQuestion || undefined,
          securityAnswer: securityAnswer || undefined,
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Keamanan akun berhasil diperbarui!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSecurityAnswer('');
      } else {
        setErrorMsg(data.message || 'Gagal memperbarui keamanan.');
      }
    } catch (err) {
      setErrorMsg('Gagal menyambungkan ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Keamanan & Kredensial Admin</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <form onSubmit={handleUpdateSecurity} className="space-y-6 lg:col-span-2">
          {/* Form Keamanan */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            
            {/* Password section */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b dark:border-gray-800 pb-2">
                <Lock size={18} className="text-[#2D5A27] dark:text-green-400" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Ganti Password Admin</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Password Lama (Wajib dimasukkan untuk verifikasi)</label>
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Password Baru (Opsional)</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 border dark:border-gray-755 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                    placeholder="Kosongkan jika hanya ganti pertanyaan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 border dark:border-gray-755 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                    placeholder="Kosongkan jika hanya ganti pertanyaan"
                  />
                </div>
              </div>
            </div>

            {/* Security Question section */}
            <div className="pt-4 border-t dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4 border-b dark:border-gray-800 pb-2">
                <ShieldQuestion size={18} className="text-[#2D5A27] dark:text-green-400" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Pengaturan Lupa Password (Pertanyaan Keamanan)</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Pertanyaan Keamanan</label>
                  <input 
                    type="text" 
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                    placeholder="Contoh: Siapa nama guru SD favorit Anda?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Jawaban Keamanan Baru (Rahasia)</label>
                  <input 
                    type="password" 
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                    placeholder="Masukkan jawaban rahasia untuk pertanyaan di atas..."
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Jawaban ini digunakan untuk mereset password di halaman login bila Anda lupa.</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            {errorMsg && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 p-3 rounded-lg border dark:border-red-900/30">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 p-3 rounded-lg border dark:border-green-900/30 text-center font-bold">{successMsg}</p>
            )}

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#2D5A27] hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:bg-gray-400"
              >
                <Save size={18} /> {isLoading ? 'Menyimpan...' : 'Simpan Kredensial'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KelolaAkun;
